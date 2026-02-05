import { useState } from "react";
import Api from "../../api";
import { useNavigate } from "react-router";
import { useMutation } from "@tanstack/react-query";

export default function ProductCreate() {
  const [image, setImage] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [preview, setPreview] = useState(null);
  const [errors, setErrors] = useState({});

  const navigate = useNavigate();

  const handleFileChange = (e) => {
    //jika ada gambar set gambar
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);

      //lihat image preview
      const imgUrl = URL.createObjectURL(e.target.files[0]);
      setPreview(imgUrl);
    }
  };

  const mutationProduct = useMutation({
    mutationFn: async (formData) => {
      const response = await Api.post("/api/products", formData);
      return response.data;
    },
    onSuccess: () => {
      navigate("/products");
    },
    onError: (error) => {
      setErrors(error.response.data);
    },
  });

  const storeProduct = (e) => {
    e.preventDefault();

    const formData = new FormData();
    if (image) formData.append("image", image);
    formData.append("title", title);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("stock", stock);

    mutationProduct.mutate(formData);
  };

  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-md-12">
          <div className="card border-0 rounded-3 shadow">
            <div className="card-body">
              <form onSubmit={storeProduct}>
                <div className="mb-3">
                  <label htmlFor="" className="form-label fw-bold">
                    Image
                  </label>
                  <input
                    type="file"
                    onChange={handleFileChange}
                    className="form-control"
                  />
                  {preview && (
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
                  {mutationProduct.isPending ? "Saving..." : "Save"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
