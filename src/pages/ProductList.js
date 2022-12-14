import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function ProductList() {
  const [allProducts, setAllProducts] = useState([]);

  const [selectedProducts, setSelectedProducts] = useState({
    product_ids: [],
  });

  useEffect(function () {
    fetch("https://asscandiwebtest.herokuapp.com/products")
      .then((response) => response.json())
      .then((data) => setAllProducts(data))
      .catch((err) => console.log("err",err));
  }, []);

  function handleDeleteClick() {
    if (selectedProducts.product_ids.length > 0) {
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

      // let urlencoded = new URLSearchParams();
      let urlencoded = {ids: []}
      for (
        let index = 0;
        index < selectedProducts.product_ids.length;
        index++
      ) {
        urlencoded.ids.push(selectedProducts.product_ids[index])
      }

      const requestOptions = {
        method: "DELETE",
        headers: myHeaders,
        body: JSON.stringify(urlencoded),
        redirect: "follow",
        'Access-Control-Allow-Origin':'*',
      };

      fetch(
        "https://asscandiwebtest.herokuapp.com/products",
        requestOptions
      )
        .then((response) => response.text())
        .then((result) => {
          console.log(result);

          const productIds = selectedProducts.product_ids;

          // Filter out all the deleted IDs (leave the ones that are not deleted)
          const newProductList = allProducts.filter((product) => {
            if (productIds.includes(product.id)) {
              return false;
            } else {
              return true;
            }
          });

          // Empty out the selected Product list
          setSelectedProducts({ product_ids: [] });
          setAllProducts(newProductList);
        })
        .catch((error) => console.log("error", error));
    }
  }

  function handleCheckboxChange(event) {
    console.log(' event.target.id',  event.target.id)
    const { id, name, value, type, checked } = event.target;

    let selectedProduct_ids = selectedProducts.product_ids;
    selectedProduct_ids.push(parseInt(id));
    const newSelectedProducts = {
      ...selectedProducts,
      [id]: selectedProduct_ids,
    };
    setSelectedProducts(newSelectedProducts);
  }

  const productElementGrid = allProducts.map((product) => {
    return (
      <div className="panel panel-default" key={product.id}>
        <input
          type="checkbox"
          className="delete-checkbox"
          id={product.id}
          name="product_ids"
          onChange={handleCheckboxChange}
          value={product.id}
        />
        <br />

        {product.sku}
        <br />

        {product.name}
        <br />

        {product.price}
        <br />

        {product.size}
      </div>
    );
  });

  return (
    <div>
      <div className="container">
        <div className=".fixed-header">
          <div className="row">
            <div className="col-md-7">
              <h1>
                <b>Product List</b>
              </h1>
            </div>
            <div className="col-md-2">
              <Link
                to="/add-product"
                id="add_button"
                className="btn btn-success btn-sm"
              >
                ADD
              </Link>
            </div>
            <div className="col-md-3">
              <button
                id="delete-product-btn"
                className="btn btn-danger btn-sm"
                onClick={handleDeleteClick}
              >
                MASS DELETE
              </button>
            </div>
          </div>
          <hr />
        </div>
        {/* <!-- beneath the header -->*/}

        <form action="" id="product_list_form" method="post">
          <div className="flex-container">
            {/* ProductGrid */}

            {allProducts.length >= 1 && productElementGrid}
          </div>
        </form>
      </div>
    </div>
  );
}
