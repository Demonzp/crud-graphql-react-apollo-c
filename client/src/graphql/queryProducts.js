import { gql } from '@apollo/client';

export const GET_PRODUCTS = gql`
  query GetProducts{
    getProducts{
      _id
      price
      name
    }
  }
`;

export const GET_PRODUCT = gql`
  query GetProduct($_id: ID!){
    getProduct(_id: $_id){
      _id
      price
      name
      createdAt
      updatedAt
    }
  }
`;

export const ADD_PRODUCT = gql`
  mutation CreateProduct($name: String!, $price: Float!){
    createProduct(name: $name, price: $price){
      _id
      price
      name
    }
  }
`;

export const UPDATE_PRODUCT = gql`
  mutation UpdateProduct($_id: ID!, $name: String!, $price: Float!){
    updateProduct(_id: $_id, name: $name, price: $price){
      _id
      price
      name
    }
  }
`;

export const DELETE_PRODUCT = gql`
  mutation DeleteProduct($_id: ID!){
    deleteProduct(_id: $_id) {
      result
    }
  }
`;