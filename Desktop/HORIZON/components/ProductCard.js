import React from "react";

const ProductCard = ({ product }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition duration-300">
      <div
        className={`h-3 ${product.type === "license" ? "bg-blue-500" : "bg-green-500"}`}
      ></div>
      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-bold text-gray-800">{product.title}</h3>
          {product.state && (
            <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">
              {product.state}
            </span>
          )}
        </div>
        <p className="text-gray-600 text-sm mb-4">{product.description}</p>

        <div className="flex items-center justify-between mb-4">
          <span className="text-2xl font-bold text-gray-900">
            {product.price}
          </span>
          <span className="text-xs bg-gray-100 px-2 py-1 rounded">
            {product.delivery}
          </span>
        </div>

        <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition duration-300">
          Add to Cart
        </button>

        {product.type === "license" && (
          <p className="text-xs text-gray-500 mt-2 text-center">
            Scannable | UV Features | Realistic
          </p>
        )}
        {product.type === "account" && (
          <p className="text-xs text-gray-500 mt-2 text-center">
            Instant Delivery | Warranty Included
          </p>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
