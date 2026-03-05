import React from "react";
import { useParams } from "react-router-dom";

const ProductDetails = ({ products, addToCart }) => {
  const { id } = useParams();

  const product = products.find((item) => item.id === parseInt(id));

  if (!product) {
    return <h2>Product not found</h2>;
  }

  return (
    <div className="details-container">
      <img src={product.image} alt={product.name} width="300" />

      <h2>{product.name}</h2>
      <p><strong>Price:</strong> ₹{product.price}</p>
      <p><strong>Description:</strong> {product.description}</p>

      <button onClick={() => addToCart(product)}>
        Add to Cart
      </button>

      <button style={{ marginLeft: "10px" }}>
        Order Now
      </button>
    </div>
  );
};

export default ProductDetails;