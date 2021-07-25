import { gql, useMutation, useQuery } from '@apollo/client';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button, Form, FormGroup, Input, Label, Modal, ModalHeader, ModalBody, ModalFooter, Table, Col } from 'reactstrap';
import { GET_PRODUCTS, ADD_PRODUCT, DELETE_PRODUCT, UPDATE_PRODUCT } from '../graphql/queryProducts';

const ProductsList = () => {
  const [products, setProducts] = useState([]);

  const [createProductName, setCreateProductName] = useState('');
  const [createProductPrice, setCreateProductPrice] = useState('');

  const [editProductId, setEditProductId] = useState('');
  const [editProductName, setEditProductName] = useState('');
  const [editProductPrice, setEditProductPrice] = useState('');

  const [createProductModal, setCreateProductModal] = useState(false);
  const [editProductModal, setEditProductModal] = useState(false);

  const toggleCreateProductModal = () => setCreateProductModal(!createProductModal);
  const toggleEditProductModal = () => setEditProductModal(!editProductModal);
  
  const { data: dataLoadProd } = useQuery(GET_PRODUCTS);
  const [addProduct] = useMutation(ADD_PRODUCT, {
    update(cache, { data: { createProduct } }) {
      cache.modify({
        fields: {
          getProducts(existingProducts = []) {
            const newProductRef = cache.writeFragment({
              data: createProduct,
              fragment: gql`
                          fragment NewProduct on GetProducts {
                              _id
                              name
                              price
                          }
                      `
            });
            return [...existingProducts, newProductRef];
          }
        }
      })
    }
  });
  const [delProduct] = useMutation(DELETE_PRODUCT, {
    update(cache, { data: { deleteProduct } }) {
      cache.modify({
        fields: {
          getProducts(existingProducts = [], { readField }) {
            return existingProducts.filter(
              productRef => deleteProduct._id !== readField('_id', productRef)
            );
          }
        }
      })
    }
  });
  const [updateProduct] = useMutation(UPDATE_PRODUCT);

  useEffect(() => {
    if (dataLoadProd) {
      setProducts(dataLoadProd.getProducts);
    }
  }, [dataLoadProd]);

  const editProductHandler = (_id) => {
    const product = products.find((el) => el._id === _id);
    setEditProductId(_id);
    setEditProductName(product.name);
    setEditProductPrice(product.price);
    toggleEditProductModal();
  };

  const updateProductHandler = () => {
    updateProduct({
      variables: {
        _id: editProductId,
        name: editProductName,
        price: Number(editProductPrice)
      }
    });
    toggleEditProductModal();
  };

  const clearInput = () => {
    setCreateProductName('');
    setCreateProductPrice('');
  };

  const addProductHandler = () => {
    addProduct({ variables: { name: createProductName, price: Number(createProductPrice) } });
    toggleCreateProductModal();
    clearInput();
  };

  const deleteProductHandler = (_id) => {
    delProduct({ variables: { _id } });
  };

  return (
    <React.Fragment>
      <br />
      <h1>List of Products</h1>
      <br />
      <Button color='success' outline onClick={toggleCreateProductModal}>ADD NEW PRODUCT</Button>
      <br />
      <br />
      <Modal isOpen={createProductModal} toggle={toggleCreateProductModal}>
        <ModalHeader toggle={toggleCreateProductModal}>Please add a new product:</ModalHeader>
        <ModalBody>
          <Form>
            <FormGroup>
              <Label for='name'>Name:</Label>
              <Input id='name'
                placeholder='ex. AMD Ryzen 5 3600'
                value={createProductName}
                onChange={(event) => { setCreateProductName(event.target.value) }} />
              <br />
              <Label for='price'>Price:</Label>
              <Input id='price'
                placeholder='ex. 5000.00'
                value={createProductPrice}
                onChange={(event) => { setCreateProductPrice(event.target.value) }} />
            </FormGroup>
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button color='primary' onClick={addProductHandler}>ADD</Button>{' '}
          <Button color='secondary' onClick={toggleCreateProductModal}>CANCEL</Button>
        </ModalFooter>
      </Modal>

      <Modal isOpen={editProductModal} toggle={toggleEditProductModal}>
        <ModalHeader toggle={toggleEditProductModal}>Edit product info:</ModalHeader>
        <ModalBody>
          <Form>
            <FormGroup>
              <Label for='name'>Name:</Label>
              <Input id='name'
                value={editProductName}
                onChange={(event) => { setEditProductName(event.target.value) }} />
              <br />
              <Label for='price'>Price:</Label>
              <Input id='price'
                value={editProductPrice}
                onChange={(event) => { setEditProductPrice(event.target.value) }} />
            </FormGroup>
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button color='primary' onClick={updateProductHandler}>UPDATE</Button>{' '}
          <Button color='secondary' onClick={toggleEditProductModal}>CANCEL</Button>
        </ModalFooter>
      </Modal>
      <Table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Price</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => {
            return (
              <tr key={product._id}>
                <th scope="row">
                  <Link to={`/product?id=${product._id}`}>{product._id}</Link>
                </th>
                <td>{product.name}</td>
                <td>{product.price}</td>
                <td>
                  <Col>
                    <Button onClick={() => editProductHandler(product._id)}>
                      Edit
                    </Button>
                    <Button onClick={() => deleteProductHandler(product._id)}>
                      DELETE
                    </Button>
                  </Col>
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </React.Fragment>
  );
};

export default ProductsList;