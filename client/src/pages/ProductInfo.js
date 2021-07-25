import React, { useState, useEffect } from 'react';
import { Table } from 'reactstrap';
import { useQuery } from '@apollo/client';

import { GET_ONE_PRODUCT } from '../graphql/queries';

const ProductInfo = ({ match }) => {
    const _id = match.params.id;

    const [product, setProduct] = useState();

    const { data, loading } = useQuery(GET_ONE_PRODUCT, {
        variables: {
            _id
        }
    });

    useEffect(() => {
        getProduct();
    }, [data]);
    
    /////////////////////////////////// REQUESTS ////////////////////////////////

    // GET
    const getProduct = async () => {
        try {
            if (loading) {
                <h3>LOADING...</h3>
            } else {
                setProduct(data.getProduct);
            };
        } catch (err) {
            console.error(err);
        };
    };

    /////////////////////////////////// RENDERING ////////////////////////////////

    return (
        <div className='App container'>
            <br />
            <h1>Product Info</h1>
            <br />
            {
                product ?
                    <Table bordered striped size='sm'>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>NAME</th>
                                <th>PRICE</th>
                                <th>CREATED_AT</th>
                                <th>UPDATED_AT</th>
                            </tr>
                        </thead>

                        <tbody>
                            <tr>
                                <td>{product._id}</td>
                                <td>{product.name}</td>
                                <td>{product.price}</td>
                                <td>{product.createdAt}</td>
                                <td>{product.updatedAt}</td>
                            </tr>
                        </tbody>
                    </Table>
                    :
                    <div>LOADING...</div>
            }
        </div>
    );
};

export default ProductInfo;