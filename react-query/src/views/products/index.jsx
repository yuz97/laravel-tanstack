import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Api from "../../api";
import { Link } from "react-router";
import Swal from "sweetalert2";

export default function ProductIndex() {
  const queryClient = useQueryClient();

  // fetch data from API using react query
  const { data, isLoading, isError, error } = useQuery({
    // set the query key
    queryKey: ["products"],
    // set the query function
    queryFn: async () => {
      const { data } = await Api.get("/api/products");
      return data.data;
    },
  });

  // mutation for deleting product
  const deleteProduct = useMutation({
    mutationFn: async (slug) => {
      await Api.delete(`/api/products/${slug}`);
    },
    onSuccess: () => {
      // Refresh the product list after deletion
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });

  const handleDelete = (slug) => {
    // if (confirm("are you sure wanna delete this product?")) {
    //   deleteProduct.mutate(id);
    // }

    new Swal({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover this product file!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes",
    }).then((res) => {
      if (res.isConfirmed) {
        deleteProduct.mutate(slug);
      }
    });
  };
  return (
    <div className="container mt-5 mb-5">
      <div className="row">
        <div className="col-md-12">
          <Link
            to={"/products/create"}
            className="btn btn-success btn-md rounded-5 shadow border-0 mb-3"
          >
            ADD NEW PRODUCT
          </Link>
          <div className="card border-0 rounded-3 shadow">
            <div className="card-body">
              {/* loading state  */}
              {isLoading && (
                <div className="alert alert-info text-center">Loading...</div>
              )}

              {/* error state  */}
              {isError && (
                <div className="alert alert-danger text-center">
                  Error:{error.message}
                </div>
              )}

              {!isLoading && !isError && (
                <table className="table table-bordered">
                  <thead className="bg-dark text-white">
                    <tr>
                      <th scope="col">Image</th>
                      <th scope="col">Title</th>
                      <th scope="col">Description</th>
                      <th scope="col">Price</th>
                      <th scope="col">Stock</th>
                      <th scope="col" style={{ width: "15%" }}>
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.length > 0 ? (
                      data.map((product) => (
                        <tr key={product.id}>
                          <td className="text-center">
                            <img
                              src={product.image}
                              alt={product.title}
                              width="200"
                              className="rounded-3"
                            />
                          </td>
                          <td>{product.title}</td>
                          <td>{product.description}</td>
                          <td>{product.price?.toLocaleString("id-ID")}</td>
                          <td>{product.stock}</td>
                          <td className="text-center">
                            <Link
                              to={`/products/edit/${product.slug}`}
                              className="btn btn-sm btn-primary rounded-5 shadow border-0 me-2"
                            >
                              Edit
                            </Link>
                            <button
                              onClick={() => handleDelete(product.slug)}
                              className="btn btn-sm btn-danger rounded-5 shadow border-0"
                              disabled={deleteProduct.isPending}
                            >
                              {deleteProduct.isPending ? "..." : "Delete"}
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="text-center">
                          <div className="alert alert-danger mb-0">
                            No data available
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
