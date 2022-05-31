let admin = require('firebase-admin');
const FIRESTORE_PATH_FILE = require('../db/curso-backend-f7673-firebase-adminsdk-oei4t-0768c48474.json');

admin.initializeApp({
  credential: admin.credential.cert(FIRESTORE_PATH_FILE)
})

const db = admin.firestore()

class ContenedorFirebase {
  constructor(collection) {
    this.collection = db.collection(collection)
    console.log(`Firebase conectada con la collection ${collection}`)
  }

  async save(document){
    let doc = this.collection.doc()
    let item = await doc.create(document)
    return item
  }

  async getAll(){
    let result = await this.collection.get();
    result = result.docs.map(doc => ({ 
      id: doc.id,
      data: doc.data()
    }))
    return result
  }

  async getById(id){
    let result = await this.collection.get()
    result = result.docs.map(doc => ({ 
      id: doc.id,
      data: doc.data()
    }))
    let item = result.find(elem => elem.id == id)
    return item
  }

  async delete(id){
    let doc = this.collection.doc(`${id}`)
    let item = doc.delete()
    return ({ status: 'Deleted' })
  }

  async update(id, content){
    let doc = this.collection.doc(`${id}`)
    let item = await doc.update(content)
    return item
  }
}

module.exports =  ContenedorFirebase;