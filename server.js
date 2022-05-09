const express = require('express');
const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLSchema,
    GraphQLList,
    GraphQLNonNull,
    GraphQLInt
} = require('graphql');
const expressGraphql = require('express-graphql');
const { GraphQLSchema, GraphQLObjectType, GraphQLString } = require('graphql');

const app = express();
const PORT = 5000;

const authors = [
    {id: 1, name: 'Ecart Tolle'}, 
    {id: 2, name: 'Robin Sharma'}, 
    {id: 3, name: 'Youval Noah Harari'}, 
    {id: 4, name: 'Elif Shafak'}, 
    {id: 5, name: 'Alex Rauschmayer'}, 
    {id: 6, name: 'Flavio Copes' }
]

const books = [
    {id: 1, name: 'The Power Of Now', aurthorId: 1},
    {id: 2, name: '5 am Club', aurthorId: 2},
    {id: 3, name: 'Sapians', aurthorId: 3},
    {id: 4, name: '21 Lessions for 21st Century', aurthorId: 3},
    {id: 5, name: 'Fourty Rules Of Love ', aurthorId: 4},
    {id: 6, name: 'Impacient JavaScript', aurthorId: 5},
    {id: 7, name: 'ES6 and Next js', aurthorId: 6}
]
const BookType = new GraphQLObjectType({
    name: 'Book',
    description: 'Represents a book written by an author',
    fields: () => ({
        id: {type: GraphQLNonNull(GraphQLInt)},
        name: {type: GraphQLNonNull(GraphQLString)},
        authorId: {type: GraphQLNonNull(GraphQLInt)},
        author: {
            type: AuthorType
        }
    })
})
const AuthorType = new GraphQLObjectType({
    name: 'Author',
    description: 'This represents an author of a book',
    fields: () => ({
        id: {type: GraphQLNonNull(GraphQLInt)},
        name: {type: GraphQLNonNull(GraphQLString)},
        authorId: {type: GraphQLNonNull(GraphQLInt)},
        author: {
            type: AuthorType,
            resolve: (book) => {
                return author.find(author.id === book.aurthorId) 
            }
        }
})
})
const RootQuery = new GraphQLObjectType({
    name: 'Query',
    description: 'Root Query',
    fields: ()=> ({
        book: {
            type: BookType,
            description : 'A single book',
            args: {
                id: {type: GraphQLInt}
            },
            fields: (parent, args) => books.find(books.id === args.id) 
        },
        book: {
            type: new GraphQLList(BookType),
            description: 'List of All Books',
            resolve: () => books

        },
        author: {
            type: AuthorType,
            description: 'A single Author',
            args: {
                id: {type: GraphQLInt}
            },
            resolve: (parent,args) => author.find(authors.id === args.id)

        },
        authors: {
            type: new GraphQLList(AuthorType),
            description: 'List of All Authors',
            resolve: () => authors

        }
    })
})

const RootMutationType = new GraphQLObjectType({
    name: 'mutation',
    description : 'Root mutation',
    fields: ()=> ({
        addBook: {
            type: BookType,
            description: 'Add a book',
            args: {
                name: {type: GraphQLNonNull(GraphQLString)},
                authorId: {type: GraphQLNonNull(GraphQLInt)},
            },
            resolve: (parent, args) => {
                const book = {id: book.length+1, name: args.name, authorId: args.authorId}
                books.push(book)
                return book
            } 

        },
        addAuthor: {
            type: AuthorType,
            description: 'Add an Author',
            args: {
                name: {type: GraphQLNonNull(GraphQLString)},
            },
            resolve: (parent, args) => {
                const author = {id: author.length+1, name: args.name}
                authors.push(author)
                return author
            } 

        }
    })
        
})

const schema = new GraphQLSchema({
    query: RootQueryType,
    mutation: RootMutationType
})
app.use('/graphql', expressGraphql ({
    schema: schema,
    graphiql: true,
}))
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
