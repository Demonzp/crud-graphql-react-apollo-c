import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button, Form, FormGroup, Input, Label, Modal, ModalHeader, ModalBody, ModalFooter, Table } from 'reactstrap';
import { useQuery, useMutation, gql } from '@apollo/client';

import { GET_ALL_PRODUCTS, CREATE_PRODUCT, UPDATE_PRODUCT, DELETE_PRODUCT } from '../graphql/queries';

const Products = () => {

    const [products, setProducts] = useState([]);

    const [createProductName, setCreateProductName] = useState('');
    const [createProductPrice, setCreateProductPrice] = useState('');

    const [editProductId, setEditProductId] = useState('');
    const [editProductName, setEditProductName] = useState('');
    const [editProductPrice, setEditProductPrice] = useState(0);

    const [createProductModal, setCreateProductModal] = useState(false);
    const [editProductModal, setEditProductModal] = useState(false);

    const { data, loading } = useQuery(GET_ALL_PRODUCTS);
    const [createProduct] = useMutation(CREATE_PRODUCT, {
        update(cache, { data: { createProduct } }) {
            cache.modify({
                fields: {
                    getProducts(existingProducts = []) {
                        const newProductRef = cache.writeFragment({
                            data: createProduct,
                            fragment: gql`
                                fragment NewProduct on GetAllProducts {
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
    const [updateProduct] = useMutation(UPDATE_PRODUCT);
    const [deleteProduct] = useMutation(DELETE_PRODUCT, {
        update(cache, { data: {deleteProduct} }) {
            cache.modify({
                fields: {
                    getProducts(existingProducts = [], { readField }) {
                        return  existingProducts.filter(
                                productRef => deleteProduct._id !== readField('_id', productRef)
                            );
                    }
                }
            })
        }
    });

    useEffect(() => {
        getProducts();
    }, [data]);

    const toggleCreateProductModal = () => setCreateProductModal(!createProductModal);
    const toggleEditProductModal = () => setEditProductModal(!editProductModal);

    /////////////////////////////////// REQUESTS ////////////////////////////////

    // GET
    const getProducts = async () => {
        try {
            if (loading) {
                <h3>LOADING...</h3>
            } else {
                setProducts(data.getProducts);
            };
        } catch (err) {
            console.error(err);
        };
    };

    // POST
    const addProductHandler = async () => {
        try {
            const result = await createProduct({
                variables: {
                    name: createProductName,
                    price: Number(createProductPrice),
                }
            });

            const newProduct = result.data.createProduct;
            const updProducts = [...products, { ...newProduct }];

            setProducts(updProducts);
            toggleCreateProductModal();
        } catch (err) {
            console.error(err);
        };
    };

    // EDIT - NOT FULLY WORKING YET
    const updateProductHandler = async () => {
        try {
            const result = await updateProduct({
                variables: {
                    _id: editProductId,
                    name: editProductName,
                    price: Number(editProductPrice),
                }
            });

            const updElement = result.data.updateProduct;
            const index = products.findIndex((el) => el._id === editProductId);

            const updProducts = [
                ...products.slice(0, index),
                updElement,
                ...products.slice(index + 1)
            ];

            setProducts(updProducts);
            toggleEditProductModal();
        } catch (err) {
            console.error(err);
        };
    };

    const editProductHandler = async (_id) => {
        try {
            const product = products.find((el) => el._id === _id);
            setEditProductId(_id);
            setEditProductName(product.name);
            setEditProductPrice(product.price);
            toggleEditProductModal();
        } catch (err) {
            console.error(err);
        };
    };

    // DELETE
    const deleteProductHandler = async (_id) => {
        try {
            await deleteProduct({
                variables: {
                    _id
                }
            });

            const index = products.findIndex((el) => el._id === _id);
            const updProducts = [
                ...products.slice(0, index),
                ...products.slice(index + 1),
            ];

            setProducts(updProducts);
        } catch (err) {
            console.error(err);
        };
    };

    /////////////////////////////////// RENDERING ////////////////////////////////

    return (
        <div className='App container'>
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

            <Table bordered striped size='sm'>
                <thead>
                    <tr>
                        <th>NAME</th>
                        <th>PRICE</th>
                        <th>ACTIONS</th>
                    </tr>
                </thead>

                <tbody>
                    {products.map((product) => (
                        <tr key={product._id}>
                            <td>
                                <Link to={`/product/${product._id}`}>{product.name}</Link>
                            </td>
                            <td>{product.price}</td>
                            <td>
                                <Button color='secondary' size='sm' className='mr-2' outline onClick={() => { editProductHandler(product._id) }}>EDIT</Button>{' '}
                                <Button color='danger' size='sm' outline onClick={() => { deleteProductHandler(product._id) }}>DELETE</Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
    );
};

export default Products;