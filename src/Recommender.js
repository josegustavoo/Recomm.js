const { MongoClient, ObjectID } = require('mongodb');
const sw = require('stopword');

const CacheService = require('./cache');

class Recommender {
	options = {
		database: 'mongodb',
		connection: {},
		cache: 60 * 60 * 1,
		table: 'posts',
		fields: [ 'title', 'description' ],
		returnOptions: {
			fields: [ '_id' ],
			limit: 25
		}
	}
	
	constructor(options = {}) {
		if(options) {
			this.options = Object.assign({}, this.options, {
				...options,
				returnOptions: {
					...this.options.returnOptions,
					...options.returnOptions
				}
			});
		}
		this.validateOptions(this.options);
		
		const uri = this.options.connection.uri;
		this.client = new MongoClient(uri, {
			useUnifiedTopology: true,
			poolSize: 10
		});
		
		const ttl = this.options.cache;
		this.cache = new CacheService(ttl);
	}
	
	/* Client functions */
	async getPosts() {
		return this.cache.get('recommender_posts', async () => {
			return await this.getAllPosts({}, {
				'_id': 1,
				'recommender_tag': 1
			})
		});
	}
	
	async getRecommendersPosts(postId) {
		let postsFiltered = [];
		if(typeof postId !== 'string')
			throw new Error("postId is not string");
			
		return this.cache.get('recommended_posts_' + postId, async () => {
			postId = new ObjectID(postId);
			const target = await this.getPostById(postId);
			
			let fields = [];
			fields['score'] = { $meta: "textScore" }
			this.options.returnOptions.fields.map(field => {
				fields[field] = 1;
			});
			fields = Object.assign({}, fields);
			
			postsFiltered = await this.db.collection(this.options.table)
				.find({
					$text: { $search: target.recommender_tag },
					_id: { $ne: postId }
				})
				.project(fields)
				.sort({ score: { $meta:"textScore" } })
				.limit(this.options.returnOptions.limit)
				.toArray();
			
			return postsFiltered;
		});
	}
	
	async sync() {
		await this.init();
		await this.createIndex();
		
		const posts = await this.getAllPosts();
		posts.map(async item => {
			item.recommender_tag = this.generateTag(item);
			this.updateItem(item);
		});
	}
	
	/* Functional */
	
	async init() {
		await this.connectToDB();
	}
	
	async connectToDB() {
		try {
			await this.client.connect();
			
			this.db = this.client.db('database');
		} catch(e) {
			throw new Error(e);
		}
	}
	
	validateOptions(options) {
		if(typeof options.database !== 'string' || !options.database)
			throw new Error('invalid database option');
		
		if(options.database != 'mongodb')
			throw new Error('database not supported');
		
		if(typeof options.connection.uri !== 'string' || !options.connection.uri)
			throw new Error('invalid connection uri');
		
		if(typeof options.cache !== 'number')
			throw new Error('invalid type of cache option');
		
		if(typeof options.table !== 'string' || !options.table)
			throw new Error('invalid table option');
		
		if(typeof options.fields !== 'object' || !options.fields)
			throw new Error('fields is not an array');
		
		if(typeof options.returnOptions !== 'object' || !options.returnOptions)
			throw new Error('fields is not an array');
			
		if(typeof options.returnOptions.fields !== 'object' || !options.returnOptions.fields)
			throw new Error('returnOptions.fields is not an array');
	}
	
	async createIndex() {
		await this.db.collection(this.options.table).createIndex({ "recommender_tag": 'text' });
	}
	
	async getAllPosts(filterQuery = {}, fields = null) {
		if(fields == null) {
			fields = [];
			fields['_id'] = 1;
			this.options.fields.map(field => {
				if(field.includes('.')) {
					let [ key ] = field.split('.');
					fields[key] = 1;
				} else {
					fields[field] = 1;
				}
			});
			
			fields = Object.assign({}, fields);
		} else {
			fields = fields;
		}
		
		return await this.db.collection(this.options.table)
			.find(filterQuery)
			.project(fields)
			.toArray();
	}
	
	async getPostById(postId, projection) {
		projection = projection == null ? {
			'_id': 1,
			'recommender_tag': 1
		} : projection;
		
		return await this.db.collection(this.options.table).findOne(
			{ _id: postId },
			{ projection });
	}
	
	async updateItem(item) {
		this.db.collection(this.options.table).updateOne(
			{ _id: new ObjectID(item._id) },
			{ $set: item },
			{ upsert: true });
	}
	
	simplify(text) {
		let newText = sw.removeStopwords(text.split(' '), sw.ptbr);
		newText = newText.join(' ');
		newText = newText.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
		newText = newText.replace(/[^\w\s]/gi, '').replace(/\s+/g, " ");
		return newText;
	}
	
	generateTag(item) {
		let tag = [];
		for(let i=0;i<this.options.fields.length;i++) {
			let field = this.options.fields[i];
			if(field.includes('.')) {
				let [ key, value ] = field.split('.');
				
				let subitems = item[key].map(subitem => {
					return subitem[value];
				});
				tag.push(subitems.join(' '));
			} else {
				let text = this.simplify(item[field]);
				tag.push(text);
			}
		}
		return tag.join(' ');
	}
}
