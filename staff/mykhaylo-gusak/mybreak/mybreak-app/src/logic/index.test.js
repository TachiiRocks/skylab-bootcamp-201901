import dataApi from '../data/dataApi'
import logic from './index.js'
const faker = require('faker')
const { mongoose, models: { User, Product, Order } } = require('mybreak-data');

const url = 'mongodb://localhost/test-mybreak-app-dataApi';

describe('dataApi', () => {
    let name, surname, email, password, age, name2, surname2, email2, password2, age2

    beforeAll(() => mongoose.connect(url, { useNewUrlParser: true }))

    beforeEach(async () => {
        await User.deleteMany()

        name = faker.name.firstName()
        surname = faker.name.lastName()
        email = faker.internet.email()
        password = 'da33ddf'
        age = faker.random.number()

        name2 = faker.name.firstName()
        surname2 = faker.name.lastName()
        email2 = faker.internet.email()
        password2 = '33d332ddf'
        age2 = faker.random.number()

    })

    describe('create user', () => {
        it('should succed on corrrect user data', async () => {
            const response = await logic.registerUser(name, surname, email, password, age)
            expect(response).toBeUndefined()

            const user = await User.findOne({ email }).lean()

            expect(user).toBeDefined()

            expect(user.name).toEqual(name)
            expect(user.surname).toEqual(surname)
            expect(user.email).toEqual(email)
            expect(user.password).toEqual(password)
            expect(user.age).toEqual(age)
            expect(user.card).toEqual([])
            expect(user.orders).toEqual([])
        })

        describe('on already existing user', () => {

            beforeEach(async () => {
                await User.deleteMany()
            })

            it('should fail on already existing user', async () => {
                await User.create({ name, surname, email, password, age })
                expect(async () => await logic.registerUser(name, surname, email, password, age)).toThrowError(new Error('child "name" fails because ["name" is required]'))
                // try {
                //     const error = await logic.registerUser(name, surname, email, password, age)
                //     

                // } catch (err) {
                //    
                //     // expect(err).toThrowError(new Error(`User wh email:${email} already exists`))
                // }
            })
        })

        describe('name fails', () => {
            it('should fail on undefined name', () => {
                const name = undefined
                expect(() => logic.registerUser(name, surname, email, password, age)).toThrowError(new Error('child "name" fails because ["name" is required]'))
            })

            it('should fail on null name', () => {
                const name = null
                expect(() => logic.registerUser(name, surname, email, password, age)).toThrowError(new Error('child "name" fails because ["name" must be a string]'))
            })

            it('should fail on empty name', () => {
                const name = ''
                expect(() => logic.registerUser(name, surname, email, password, age)).toThrowError(new Error('child "name" fails because ["name" is not allowed to be empty]'))
            })

            it('should fail on blank name', () => {
                const name = '     '
                expect(() => logic.registerUser(name, surname, email, password, age)).toThrowError(new Error('child "name" fails because ["name" must only contain alpha-numeric characters]'))
            })
        })

        describe('surname fails', () => {
            it('should fail on undefined surname', () => {
                const surname = undefined
                expect(() => logic.registerUser(name, surname, email, password, age)).toThrowError(new Error('child "surname" fails because ["surname" is required]'))
            })

            it('should fail on null surname', () => {
                const surname = null
                expect(() => logic.registerUser(name, surname, email, password, age)).toThrowError(new Error('child "surname" fails because ["surname" must be a string]'))
            })

            it('should fail on empty surname', () => {
                const surname = ''
                expect(() => logic.registerUser(name, surname, email, password, age)).toThrowError(new Error('child "surname" fails because ["surname" is not allowed to be empty]'))
            })

            it('should fail on blank surname', () => {
                const surname = '     '
                expect(() => logic.registerUser(name, surname, email, password, age)).toThrowError(new Error('child "surname" fails because ["surname" must only contain alpha-numeric characters]'))
            })
        })

        describe('age fails', () => {
            it('should fail on undefined age', () => {
                const age = undefined
                expect(() => logic.registerUser(name, surname, email, password, age)).toThrowError(new Error('child "age" fails because ["age" is required]'))
            })

            it('should fail on null age', () => {
                const age = null
                expect(() => logic.registerUser(name, surname, email, password, age)).toThrowError(new Error('child "age" fails because ["age" must be a number]'))
            })

            it('should fail on empty age', () => {
                const age = ''
                expect(() => logic.registerUser(name, surname, email, password, age)).toThrowError(new Error('child "age" fails because ["age" must be a number]'))
            })
        })

        describe('email fails', () => {
            it('should fail on undefined email', () => {
                const email = undefined
                expect(() => logic.registerUser(name, surname, email, password, age)).toThrowError(new Error('child "email" fails because ["email" is required]'))
            })

            it('should fail on null email', () => {
                const email = null
                expect(() => logic.registerUser(name, surname, email, password, age)).toThrowError(new Error('child "email" fails because ["email" must be a string]'))
            })

            it('should fail on empty email', () => {
                const email = ''
                expect(() => logic.registerUser(name, surname, email, password, age)).toThrowError(new Error('child "email" fails because ["email" is not allowed to be empty]'))
            })

            it('should fail on no valid email', () => {
                const email = 'email.com'
                expect(() => logic.registerUser(name, surname, email, password, age)).toThrowError(new Error('child "email" fails because ["email" must be a valid email]'))
            })
        })

        describe('password fails', () => {
            it('should fail on undefined password', () => {
                const password = undefined
                expect(() => logic.registerUser(name, surname, email, password, age)).toThrowError(new Error('child "password" fails because ["password" is required]'))
            })

            it('should fail on null password', () => {
                const password = null
                expect(() => logic.registerUser(name, surname, email, password, age)).toThrowError(new Error('child "password" fails because ["password" must be a string]'))
            })

            it('should fail on empty password', () => {
                const password = ''
                expect(() => logic.registerUser(name, surname, email, password, age)).toThrowError(new Error('child "password" fails because ["password" is not allowed to be empty]'))
            })

            it('should fail on no valid password', () => {
                const password = 'd3d d23d'
                expect(() => logic.registerUser(name, surname, email, password, age)).toThrowError(new Error(`child "password" fails because ["password" with value "${password}" fails to match the required pattern: /^[a-zA-Z0-9]{3,30}$/]`))
            })
        })
    })

    describe('authenticate user', () => {

        beforeEach(async () => {
            await User.create({ email, password, name, surname, age })
        })

        it('should succed on corrrect user data', async () => {
            const user = await User.findOne({ email }).lean()
            expect(user).toBeDefined()

            expect(user.name).toEqual(name)
            expect(user.surname).toEqual(surname)
            expect(user.email).toEqual(email)
            expect(user.password).toEqual(password)
            expect(user.age).toEqual(age)
            expect(user.card).toEqual([])
            expect(user.orders).toEqual([])

            await logic.loginUser(email, password)
            expect(logic.isUserLoggedIn).toBeTruthy()
        })

        describe('email fails', () => {
            it('should fail on undefined email', () => {
                const email = undefined
                expect(() => logic.registerUser(name, surname, email, password, age)).toThrowError(new Error('child "email" fails because ["email" is required]'))
            })

            it('should fail on null email', () => {
                const email = null
                expect(() => logic.registerUser(name, surname, email, password, age)).toThrowError(new Error('child "email" fails because ["email" must be a string]'))
            })

            it('should fail on empty email', () => {
                const email = ''
                expect(() => logic.registerUser(name, surname, email, password, age)).toThrowError(new Error('child "email" fails because ["email" is not allowed to be empty]'))
            })

            it('should fail on no valid email', () => {
                const email = 'email.com'
                expect(() => logic.registerUser(name, surname, email, password, age)).toThrowError(new Error('child "email" fails because ["email" must be a valid email]'))
            })
        })

        describe('password fails', () => {
            it('should fail on undefined password', () => {
                const password = undefined
                expect(() => logic.registerUser(name, surname, email, password, age)).toThrowError(new Error('child "password" fails because ["password" is required]'))
            })

            it('should fail on null password', () => {
                const password = null
                expect(() => logic.registerUser(name, surname, email, password, age)).toThrowError(new Error('child "password" fails because ["password" must be a string]'))
            })

            it('should fail on empty password', () => {
                const password = ''
                expect(() => logic.registerUser(name, surname, email, password, age)).toThrowError(new Error('child "password" fails because ["password" is not allowed to be empty]'))
            })

            it('should fail on no valid password', () => {
                const password = 'd3d d23d'
                expect(() => logic.registerUser(name, surname, email, password, age)).toThrowError(new Error(`child "password" fails because ["password" with value "${password}" fails to match the required pattern: /^[a-zA-Z0-9]{3,30}$/]`))
            })
        })
    })

    describe('retrieve user', () => {

        beforeEach(async () => {
            await User.deleteMany()
            await Product.deleteMany()
            await User.create({ email, password, name, surname, age })
            await logic.loginUser(email, password)
        })

        it('should succed on corrrect user data', async () => {
            const user = await logic.retrieveUser()

            expect(user.name).toEqual(name)
            expect(user.surname).toEqual(surname)
            expect(user.email).toEqual(email)
            expect(user.password).toBeUndefined()
            expect(user._id).toBeUndefined()
            expect(user.age).toEqual(age)
            expect(user.card).toEqual([])
            expect(user.card).toBeInstanceOf(Array)
            expect(user.orders).toEqual([])
            expect(user.orders).toBeInstanceOf(Array)
        })
    })

    describe('retrieve products by category', () => {
        let productData, category, token
        beforeEach(async () => {
            await Product.deleteMany()

            productData = {
                title: faker.commerce.productName(),
                price: faker.commerce.price(),
                category: 'Drink',
                subCategory: 'Water',
                image: faker.image.imageUrl()
            }

            await Product.create(productData)
            await User.create({ email, password, name, surname, age })
            category = 'Drink'
            await logic.loginUser(email, password)
        })

        it('should succed on corrrect products category', async () => {
            const products = await logic.retrieveProducts(category)
            expect(products).toBeDefined()

            expect(products[0].title).toEqual(productData.title)
            expect(products[0].price).toEqual(productData.price)
            expect(products[0].category).toEqual(productData.category)
            expect(products[0].subCategory).toEqual(productData.subCategory)
            expect(products[0].image).toEqual(productData.image)

            const _products = await Product.find({ category }).lean()
            expect(_products).toBeDefined()
            expect(_products[0].title).toEqual(productData.title)
            expect(_products[0].price).toEqual(productData.price)
            expect(_products[0].category).toEqual(productData.category)
            expect(_products[0].subCategory).toEqual(productData.subCategory)
            expect(_products[0].image).toEqual(productData.image)
        })

        describe('category fails', () => {
            it('should fail on undefined category', () => {
                const category = undefined
                expect(() => logic.retrieveProducts(category)).toThrowError(new Error('child "category" fails because ["category" is required]'))
            })

            it('should fail on null category', () => {
                const category = null
                expect(() => logic.retrieveProducts(category)).toThrowError(new Error('child "category" fails because ["category" must be a string]'))
            })

            it('should fail on empty category', () => {
                const category = ''
                expect(() => logic.retrieveProducts(category)).toThrowError(new Error('child "category" fails because ["category" is not allowed to be empty]'))
            })

            it('should fail on no valid category', () => {
                const category = 'd3d d2_--3d'
                expect(() => logic.retrieveProducts(category)).toThrowError(new Error(`child "category" fails because ["category" with value "${category}" fails to match the required pattern: /^[a-zA-Z0-9]{3,30}$/]`))
            })
        })
    })

    describe('retrieve all products', () => {
        let category, token
        beforeEach(async () => {
            await Product.create({ title: 'Coffee', price: '1.5', category: 'Drink', subCategory: 'Coffee', image: 'https://picsum.photos/200' })
            await Product.create({ title: 'Capuccino', price: '1.75', category: 'Drink', subCategory: 'Coffee', image: 'https://picsum.photos/200' })
            await Product.create({ title: 'Water', price: '1', category: 'Drink', subCategory: 'Water', image: 'https://picsum.photos/200' })
            await Product.create({ title: 'Cola', price: '1.25', category: 'Drink', subCategory: 'Refreshing Drinks', image: 'https://picsum.photos/200' })
            await Product.create({ title: 'Fanta', price: '1', category: 'Drink', subCategory: 'Refreshing drinks', image: 'https://picsum.photos/200' })

            await Product.create({ title: 'Apple', price: '1.5', category: 'Food', subCategory: 'Fruits', image: 'https://picsum.photos/200' })
            await Product.create({ title: 'Pineapple', price: '1.75', category: 'Food', subCategory: 'Fruits', image: 'https://picsum.photos/200' })
            await Product.create({ title: 'Coconut', price: '1', category: 'Food', subCategory: 'Fruits', image: 'https://picsum.photos/200' })
            await Product.create({ title: 'Cease', price: '1.25', category: 'Food', subCategory: 'Salade', image: 'https://picsum.photos/200' })
            await Product.create({ title: 'Green', price: '1', category: 'Food', subCategory: 'Salade', image: 'https://picsum.photos/200' })

            await Product.create({ title: 'Muffin', price: '1.5', category: 'Bakery', subCategory: 'Bakery', image: 'https://picsum.photos/200' })
            await Product.create({ title: 'Classic Coffee Cake', price: '1.75', category: 'Bakery', subCategory: 'Bakery', image: 'https://picsum.photos/200' })
            await Product.create({ title: 'Chocolate Croissant', price: '1', category: 'Bakery', subCategory: 'Bakery', image: 'https://picsum.photos/200' })
            await Product.create({ title: 'Chonga Bagel', price: '1.25', category: 'Bakery', subCategory: 'Bakery', image: 'https://picsum.photos/200' })
            await Product.create({ title: 'Almond Croissant', price: '1', category: 'Bakery', subCategory: 'Bakery', image: 'https://picsum.photos/200' })

            category = 'Drink'
            await User.create({ email, password, name, surname, age })
            await logic.loginUser(email, password)
        })

        it('should succed on corrrect products data', async () => {
            const products = await logic.retrieveAllProducts()
            expect(products).toBeDefined()

            const _products = await Product.find({ category }).lean()
            expect(_products).toBeDefined()
            expect(products[0].title).toEqual(_products[0].title)
            expect(products[1].title).toEqual(_products[1].title)
            expect(products[2].title).toEqual(_products[2].title)
            expect(products[3].title).toEqual(_products[3].title)
            expect(products[4].title).toEqual(_products[4].title)

            expect(products[0].category).toEqual(_products[0].category)
            expect(products[1].category).toEqual(_products[1].category)
            expect(products[2].category).toEqual(_products[2].category)
            expect(products[3].category).toEqual(_products[3].category)
            expect(products[4].category).toEqual(_products[4].category)

            expect(products[0].price).toEqual(_products[0].price)
            expect(products[1].price).toEqual(_products[1].price)
            expect(products[2].price).toEqual(_products[2].price)
            expect(products[3].price).toEqual(_products[3].price)
            expect(products[4].price).toEqual(_products[4].price)

            expect(products[0].price).toEqual(_products[0].price)
            expect(products[1].price).toEqual(_products[1].price)
            expect(products[2].price).toEqual(_products[2].price)
            expect(products[3].price).toEqual(_products[3].price)
            expect(products[4].price).toEqual(_products[4].price)

            expect(products[0].subCategory).toEqual(_products[0].subCategory)
            expect(products[1].subCategory).toEqual(_products[1].subCategory)
            expect(products[2].subCategory).toEqual(_products[2].subCategory)
            expect(products[3].subCategory).toEqual(_products[3].subCategory)
            expect(products[4].subCategory).toEqual(_products[4].subCategory)

            expect(products[0].image).toEqual(_products[0].image)
            expect(products[1].image).toEqual(_products[1].image)
            expect(products[2].image).toEqual(_products[2].image)
            expect(products[3].image).toEqual(_products[3].image)
            expect(products[4].image).toEqual(_products[4].image)

        })
    })

    describe('card update', () => {
        let category, productId
        beforeEach(async () => {
            await User.deleteMany()
            await Product.deleteMany()

            await Product.create({ title: 'Coffee', price: '1.5', category: 'Drink', subCategory: 'Coffee', image: 'https://picsum.photos/200' })
            await Product.create({ title: 'Capuccino', price: '1.75', category: 'Drink', subCategory: 'Coffee', image: 'https://picsum.photos/200' })
            await Product.create({ title: 'Water', price: '1', category: 'Drink', subCategory: 'Water', image: 'https://picsum.photos/200' })
            await Product.create({ title: 'Cola', price: '1.25', category: 'Drink', subCategory: 'Refreshing drinks', image: 'https://picsum.photos/200' })
            await Product.create({ title: 'Fanta', price: '1', category: 'Drink', subCategory: 'Refreshing drinks', image: 'https://picsum.photos/200' })

            await Product.create({ title: 'Apple', price: '1.5', category: 'Food', subCategory: 'Fruits', image: 'https://picsum.photos/200' })
            await Product.create({ title: 'Pineapple', price: '1.75', category: 'Food', subCategory: 'Fruits', image: 'https://picsum.photos/200' })
            await Product.create({ title: 'Coconut', price: '1', category: 'Food', subCategory: 'Fruits', image: 'https://picsum.photos/200' })
            await Product.create({ title: 'Cease', price: '1.25', category: 'Food', subCategory: 'Salade', image: 'https://picsum.photos/200' })
            await Product.create({ title: 'Green', price: '1', category: 'Food', subCategory: 'Salade', image: 'https://picsum.photos/200' })

            await Product.create({ title: 'Muffin', price: '1.5', category: 'Bakery', subCategory: 'Bakery', image: 'https://picsum.photos/200' })
            await Product.create({ title: 'Classic Coffee Cake', price: '1.75', category: 'Bakery', subCategory: 'Bakery', image: 'https://picsum.photos/200' })
            await Product.create({ title: 'Chocolate Croissant', price: '1', category: 'Bakery', subCategory: 'Bakery', image: 'https://picsum.photos/200' })
            await Product.create({ title: 'Chonga Bagel', price: '1.25', category: 'Bakery', subCategory: 'Bakery', image: 'https://picsum.photos/200' })
            await Product.create({ title: 'Almond Croissant', price: '1', category: 'Bakery', subCategory: 'Bakery', image: 'https://picsum.photos/200' })

            category = 'Drink'

            await User.create({ email, password, name, surname, age })
            await logic.loginUser(email, password)
            const products = await Product.find({ category }).lean()
            productId = products[0]._id.toString()
        })

        it('should succed on corrrect card data', async () => {
            const _products = await Product.find({ category }).lean()
            expect(_products).toBeDefined()
            expect(_products[0]._id).toBeDefined()
            expect(_products[1]._id).toBeDefined()
            expect(_products[2]._id).toBeDefined()
            expect(_products[3]._id).toBeDefined()
            expect(_products[4]._id).toBeDefined()

            const response = await logic.cardUpdate(productId)
            expect(response).toBeUndefined()

            const { card } = await User.findOne({ email }).select('card -_id').lean()
            expect(card[0].toJSON()).toBe(productId)

            const user = await logic.retrieveUser()

            expect(user.card).toBeDefined()

            expect(user.card[0]._id).toEqual(productId)

        })
    })

    describe('create order', () => {
        let category, ubication, token, productId1, productId2
        beforeEach(async () => {
            await User.deleteMany()
            await Product.deleteMany()
            await Order.deleteMany()

            await Product.create({ title: 'Coffee', price: '1.5', category: 'Drink', subCategory: 'Coffee', image: 'https://picsum.photos/200' })
            await Product.create({ title: 'Capuccino', price: '1.75', category: 'Drink', subCategory: 'Coffee', image: 'https://picsum.photos/200' })
            await Product.create({ title: 'Water', price: '1', category: 'Drink', subCategory: 'Water', image: 'https://picsum.photos/200' })
            await Product.create({ title: 'Cola', price: '1.25', category: 'Drink', subCategory: 'Refreshing Drinks', image: 'https://picsum.photos/200' })
            await Product.create({ title: 'Fanta', price: '1', category: 'Drink', subCategory: 'Refreshing drinks', image: 'https://picsum.photos/200' })

            category = 'Drink'

            await User.create({ email, password, name, surname, age })
            await logic.loginUser(email, password)

            ubication = 'ubication'

            const products = await Product.find({ category }).lean()
            productId1 = products[0]._id.toString()
            productId2 = products[1]._id.toString()
        })

        it('should succed on corrrect add data order', async () => {
            const response1 = await logic.cardUpdate(productId1)
            expect(response1).toBeUndefined()

            const response2 = await logic.cardUpdate(productId2)
            expect(response2).toBeUndefined()

            const { orders } = await User.findOne({ email }).select('orders -_id').lean()

            const user = await logic.retrieveUser()
            expect(user.orders).toBeDefined()
            expect(user.orders).toEqual([])

            expect(user.card[0]._id).toEqual(productId1)
            expect(user.card[1]._id).toEqual(productId2)

            const order = await logic.addOrder(ubication)
            expect(order.id).toBeDefined()


            const _order = await Order.find({ ubication }).lean()
            expect(_order).toBeDefined()
            expect(_order[0].products[0].toString()).toEqual(productId1)
            expect(_order[0].products[1].toString()).toEqual(productId2)

        })

        describe('ubication fails', () => {
            it('should fail on undefined ubication', () => {
                const ubication = undefined
                expect(() => logic.addOrder(ubication)).toThrowError(new Error('child "ubication" fails because ["ubication" is required]'))
            })

            it('should fail on null ubication', () => {
                const ubication = null
                expect(() => logic.addOrder(ubication)).toThrowError(new Error('child "ubication" fails because ["ubication" must be a string]'))
            })

            it('should fail on empty ubication', () => {
                const ubication = ''
                expect(() => logic.addOrder(ubication)).toThrowError(new Error('child "ubication" fails because ["ubication" is not allowed to be empty]'))
            })

            it('should fail on no valid ubication', () => {
                const ubication = 'd3d d2 3-.d'
                expect(() => logic.addOrder(ubication)).toThrowError(new Error(`child "ubication" fails because ["ubication" with value "${ubication}" fails to match the required pattern: /^[a-zA-Z0-9\\s]{3,30}$/]`))
            })
        })
    })

    describe('retrieve orders', () => {
        let category, ubication, productId1, productId2, product1, product2
        beforeEach(async () => {
            await User.deleteMany()
            await Product.deleteMany()
            await Order.deleteMany()

            await Product.create({ title: 'Coffee', price: '1.5', category: 'drink', subCategory: 'Coffee', image: 'https://picsum.photos/200' })
            await Product.create({ title: 'Capuccino', price: '1.75', category: 'drink', subCategory: 'Coffee', image: 'https://picsum.photos/200' })
            await Product.create({ title: 'Water', price: '1', category: 'drink', subCategory: 'Water', image: 'https://picsum.photos/200' })
            await Product.create({ title: 'Cola', price: '1.25', category: 'drink', subCategory: 'Refreshing drinks', image: 'https://picsum.photos/200' })
            await Product.create({ title: 'Fanta', price: '1', category: 'drink', subCategory: 'Refreshing drinks', image: 'https://picsum.photos/200' })

            category = 'drink'
            ubication = 'ubication'

            await User.create({ email, password, name, surname, age })

            const response = await dataApi.authenticate(email, password)
            const token = response.token

            const products = await Product.find({ category }).lean()
            product1 = products[0]
            product2 = products[1]
            productId1 = products[0]._id.toString()
            productId2 = products[1]._id.toString()
            await dataApi.cardUpdate(productId1, token)
            await dataApi.cardUpdate(productId2, token)
            await dataApi.createOrder(ubication, token)
        })

        it('should succed on corrrect retrieve data order', async () => {
            await logic.loginUser(email, password)
            const orders = await logic.retrieveMyOrders()
            expect(orders).toBeDefined()
            expect(orders[0].products[0]._id).toEqual(productId1)
            expect(orders[0].products[0].title).toEqual(product1.title)
            expect(orders[0].products[0].ubication).toEqual(product1.ubication)
            expect(orders[0].products[0].date).toEqual(product1.date)

            expect(orders[0].products[1]._id).toEqual(productId2)
            expect(orders[0].products[1].title).toEqual(product2.title)
            expect(orders[0].products[1].ubication).toEqual(product2.ubication)
            expect(orders[0].products[1].date).toEqual(product2.date)
        })
    })

    describe('retrieve all orders', () => {
        let category, ubication, productId1, productId2, product1, product2
        beforeEach(async () => {
            await User.deleteMany()
            await Product.deleteMany()
            await Order.deleteMany()

            await Product.create({ title: 'Coffee', price: '1.5', category: 'drink', subCategory: 'Coffee', image: 'https://picsum.photos/200' })
            await Product.create({ title: 'Capuccino', price: '1.75', category: 'drink', subCategory: 'Coffee', image: 'https://picsum.photos/200' })
            await Product.create({ title: 'Water', price: '1', category: 'drink', subCategory: 'Water', image: 'https://picsum.photos/200' })
            await Product.create({ title: 'Cola', price: '1.25', category: 'drink', subCategory: 'Refreshing drinks', image: 'https://picsum.photos/200' })
            await Product.create({ title: 'Fanta', price: '1', category: 'drink', subCategory: 'Refreshing drinks', image: 'https://picsum.photos/200' })
            category = 'drink'
            ubication = 'ubication'

            await User.create({ email, password, name, surname, age })

            const response = await dataApi.authenticate(email, password)
            const token = response.token

            const products = await Product.find({ category }).lean()
            product1 = products[0]
            product2 = products[1]
            productId1 = products[0]._id.toString()
            productId2 = products[1]._id.toString()

            await dataApi.cardUpdate(productId1, token)
            await dataApi.cardUpdate(productId2, token)
            await dataApi.createOrder(ubication, token)

        })

        it('should succed on corrrect retrieve data order', async () => {
            await logic.loginUser(email, password)
            const orders = await logic.retrieveAllOrders()

            expect(orders).toBeDefined()
            expect(orders[0].products[0]._id).toEqual(productId1)
            expect(orders[0].products[0].title).toEqual(product1.title)
            expect(orders[0].products[0].ubication).toEqual(product1.ubication)
            expect(orders[0].products[0].date).toEqual(product1.date)

            expect(orders[0].products[1]._id).toEqual(productId2)
            expect(orders[0].products[1].title).toEqual(product2.title)
            expect(orders[0].products[1].ubication).toEqual(product2.ubication)
            expect(orders[0].products[1].date).toEqual(product2.date)
        })
    })


    describe('log out', () => {
        let category, ubication, productId1, productId2, product1, product2
        beforeEach(async () => {
            await User.deleteMany()
            await Product.deleteMany()
            await Order.deleteMany()

            await User.create({ email, password, name, surname, age })
        })

        it('should succed on corrrect user log out', async () => {
            await logic.loginUser(email, password)
            expect(logic.isUserLoggedIn).toBeTruthy()
            const response = logic.logOut()
            expect(response).toBeUndefined()
            expect(logic.isUserLoggedIn).toBeFalsy()
        })
    })

    describe('retrieve order by id', () => {
        let category, ubication, token, productId1, productId2, product1, product2
        beforeEach(async () => {
            await User.deleteMany()
            await Product.deleteMany()
            await Order.deleteMany()

            await Product.create({ title: 'Coffee', price: '1.5', category: 'drink', subCategory: 'Coffee', image: 'https://picsum.photos/200' })
            await Product.create({ title: 'Capuccino', price: '1.75', category: 'drink', subCategory: 'Coffee', image: 'https://picsum.photos/200' })
            await Product.create({ title: 'Water', price: '1', category: 'drink', subCategory: 'Water', image: 'https://picsum.photos/200' })
            await Product.create({ title: 'Cola', price: '1.25', category: 'drink', subCategory: 'Refreshing drinks', image: 'https://picsum.photos/200' })
            await Product.create({ title: 'Fanta', price: '1', category: 'drink', subCategory: 'Refreshing drinks', image: 'https://picsum.photos/200' })

            await User.create({ email, password, name, surname, age })
            category = 'drink'
            ubication = 'ubication'

            const user = await dataApi.authenticate(email, password)
            token = user.token
            const products = await dataApi.retrieveProducts(category, token)
            product1 = products[0]
            product2 = products[1]
            productId1 = products[0]._id
            productId2 = products[1]._id

            await dataApi.cardUpdate(productId1, token)
            await dataApi.cardUpdate(productId2, token)
            await dataApi.createOrder(ubication, token)


        })

        it('should succed on corrrect retrieve data order', async () => {
            const { id } = await dataApi.createOrder(ubication, token)
            const orders = await logic.retrieveOrderById(id)
            expect(orders).toBeDefined()

        })

        describe('id fails', () => {
            it('should fail on undefined id', () => {
                const id = undefined
                expect(() => logic.retrieveOrderById(id)).toThrowError(new Error('child "id" fails because ["id" is required]'))
            })

            it('should fail on null id', () => {
                const id = null
                expect(() => logic.retrieveOrderById(id)).toThrowError(new Error('child "id" fails because ["id" must be a string]'))
            })

            it('should fail on empty id', () => {
                const id = ''
                expect(() => logic.retrieveOrderById(id)).toThrowError(new Error('child "id" fails because ["id" is not allowed to be empty]'))
            })

            it('should fail on no valid id', () => {
                const id = 'd3d d2 3-.d'
                expect(() => logic.retrieveOrderById(id)).toThrowError(new Error(`child "id" fails because ["id" with value "${id}" fails to match the required pattern: /^[a-zA-Z0-9]{3,30}$/]`))
            })
        })
    })
    afterAll(async () => {
        await Product.deleteMany()
        await Order.deleteMany()
        await User.deleteMany()
        mongoose.disconnect()
    })
})