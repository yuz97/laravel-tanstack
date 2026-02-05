import { useMutation, useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import Api from "../../api";

function ProductEdit() {
  const [image, setImage] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [preview, setPreview] = useState(null);
  const [errors, setErrors] = useState({});

  const navigate = useNavigate();

  const { slug } = useParams();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["product", slug],
    queryFn: async () => {
      const res = await Api.get(`/api/products/${slug}`);
      return res.data.data;
    },
  });

  //using useEffect to handle the data when it change
  useEffect(() => {
    if (data) {
      setTitle(data.title);
      setDescription(data.description);
      setPrice(data.price);
      setStock(data.stock);
      setPreview(data.image);
    }
  }, [data]);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  useEffect(() => {
    return () => {
      if (preview && preview.startsWith("blob:")) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  const mutationProduct = useMutation({
    mutationFn: async (formData) => {
      return await Api.post(`/api/products/${slug}`, formData);
    },
    onSuccess: () => {
      navigate("/products");
    },
    onError: (error) => {
      setErrors(error.response.data);
    },
  });

  const updateProduct = (e) => {
    e.preventDefault();

    const formData = new FormData();

    if (image) {
      formData.append("image", image);
    }
    formData.append("title", title);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("stock", stock);
    formData.append("_method", "PUT");

    mutationProduct.mutate(formData);
  };

  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-md-12">
          <div className="card border-0 rounded-3 shadow">
            <div className="card-body">
              {/* loading state  */}
              {isLoading && (
                <div className="alert alert-info text-center">
                  Loading product...
                </div>
              )}

              {/* error state  */}
              {isError && (
                <div className="alert alert-danger text-center">
                  Error loading product.Please try again
                </div>
              )}
              <form onSubmit={updateProduct}>
                <div className="mb-3">
                  <label htmlFor="" className="form-label fw-bold">
                    Image
                  </label>
                  <input
                    type="file"
                    onChange={handleFileChange}
                    className="form-control"
                  />
                  {!image && preview && (
                    <img
                      src={preview}
                      alt="thumbnail"
                      style={{
                        width: "200px",
                        height: "200px",
                        marginTop: "10px",
                      }}
                    />
                  )}
                  {errors.image && (
                    <div className="alert alert-danger mt-2">
                      {errors.image[0]}
                    </div>
                  )}
                </div>
                <div className="mb-3">
                  <label htmlFor="" className="form-label fw-bold">
                    Title
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Title product"
                    className="form-control"
                  />
                </div>

                {errors.title && (
                  <div className="alert alert-danger mt-2">
                    {errors.title[0]}
                  </div>
                )}

                <div className="mb-3">
                  <label htmlFor="" className="form-label fw-bold">
                    description
                  </label>
                  <textarea
                    value={description}
                    className="form-control"
                    onChange={(e) => setDescription(e.target.value)}
                    rows={5}
                    placeholder="description product"
                  ></textarea>
                </div>

                {errors.description && (
                  <div className="alert alert-danger mt-2">
                    {errors.description[0]}
                  </div>
                )}

                <div className="mb-3">
                  <label htmlFor="" className="form-label fw-bold">
                    price
                  </label>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="price product"
                    className="form-control"
                  />
                </div>

                {errors.price && (
                  <div className="alert alert-danger mt-2">
                    {errors.price[0]}
                  </div>
                )}

                <div className="mb-3">
                  <label htmlFor="" className="form-label fw-bold">
                    stock
                  </label>
                  <input
                    type="text"
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    placeholder="stock product"
                    className="form-control"
                  />
                </div>

                {errors.stock && (
                  <div className="alert alert-danger mt-2">
                    {errors.stock[0]}
                  </div>
                )}
                <button
                  type="submit"
                  className="btn btn-md btn-primary rounded-5 shadow border-0"
                  disabled={mutationProduct.isPending}
                >
                  {mutationProduct.isPending ? "Updating..." : "Update"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductEdit;
