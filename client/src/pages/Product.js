import React from 'react';
import { GET_PRODUCT } from '../graphql/queryProducts';
import { Button, Card, CardBody, CardTitle, CardText, CardSubtitle } from 'reactstrap';
import { useLocation, useHistory } from 'react-router-dom';
import { useQuery } from '@apollo/client';

const useQueryURL = () => {
  return new URLSearchParams(useLocation().search);
}

const Product = () => {
  const query = useQueryURL();
  const history = useHistory();

  const { loading, data } = useQuery(GET_PRODUCT, { variables: { _id: query.get("id") } });

  return (
    <React.Fragment>
      <Button onClick={() => history.push('/')}>Back</Button>
      {
        !loading ?
          <Card>
            <CardBody>
              <CardTitle tag="h5">Product: {data.getProduct.name}</CardTitle>
              <CardSubtitle tag="h6" className="mb-2 text-muted">Add at: {data.getProduct.createdAt} Update At: {data.getProduct.updatedAt}</CardSubtitle>
              <CardText>price: {data.getProduct.price}</CardText>
            </CardBody>
          </Card>
          :
          <div>Loading...</div>
      }
    </React.Fragment>
  );
};

export default Product;