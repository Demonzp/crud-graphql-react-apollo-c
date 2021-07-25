import { gql } from '@apollo/client';

// GET
export const GET_ALL_PRODUCTS = gql`
    query GetAllProducts {
        getProducts { 
            _id 
            name
            price
        }
    }

`

export const GET_ONE_PRODUCT = gql`
    query GetOneProduct($_id: ID!) {
        getProduct(_id: $_id) { 
            _id 
            name
            price
            createdAt
            updatedAt
        }
    }
`

// POST
export const CREATE_PRODUCT = gql` 
    mutation CreateProduct($name: String!, $price: Float!) {
        createProduct(name: $name, price: $price) { 
            _id
            name
            price
        }
    }
`

// PUT
export const UPDATE_PRODUCT = gql`
    mutation UpdateProduct($_id: ID!, $name: String!, $price: Float!) {
        updateProduct(_id: $_id, name: $name, price: $price) {
            _id
            name
            price
        }
    }
`

//DELETE
export const DELETE_PRODUCT = gql`
    mutation DeleteProduct($_id: ID!) {
        deleteProduct(_id: $_id) {
            _id
            result
        }
    }
`