
"use client";
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useGetAllReviewsQuery, useGetUserReviewsQuery } from '@/redux/services/usersApi';
 import { useGetProductByIdQuery} from '@/redux/services/productApi';
import Image from 'next/image';
const ReviewUsuario = () => {
  const { data: allReviews, isLoading: isLoadingAllReviews, isError: isErrorAllReviews, refetch: refetchAllReviews } = useGetAllReviewsQuery();
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
      refetchAllReviews();
  }, [refetchAllReviews]);

  if (isLoadingAllReviews) {
      return <div>Cargando reseñas...</div>;
  }

  if (isErrorAllReviews) {
      return <div>Error al cargar reseñas.</div>;
  }

  // Filtra las revisiones por el usuario actual
  const userReviews = allReviews.filter(review => review.user._id === user?._id);

  return (
      <div className="mt-24 p-4 bg-gray-100">
          <h2 className="text-2xl font-bold mb-4">Hola</h2>
          <div>
              <p className="text-xl mb-2">Reseñas:</p>
              {isLoadingAllReviews && <div>Cargando reseñas...</div>}
              {isErrorAllReviews && <div>Error al cargar reseñas.</div>}
              {userReviews && userReviews.map((review) => (
                  <div key={review._id} className="border p-4 mb-4 rounded">
                      {/* Realiza una solicitud individual para obtener la reseña por su ID */}
                      <ReviewDetail reviewId={review._id} />
                  </div>
              ))}
          </div>
      </div>
  );
};

const ReviewDetail = ({ reviewId }) => {
  const { data: review, isLoading, isError } = useGetUserReviewsQuery(reviewId);
  const _id= review?.product
   const { data: productById, error, isFetching } = useGetProductByIdQuery(_id); 
   
   console.log('Producto por ID:', productById);



  if (isLoading) {
    return <div>Cargando reseña...</div>;
  }

  if (isError) {
    return <div>Error al cargar reseña.</div>;
  }

  return (
    <div>
      {isLoading && <div>Cargando reseña...</div>}
      {isError && <div>Error al cargar reseña.</div>}
      {review && (
        <div>
          
          <p className="text-lg font-semibold">Producto: {review.product}</p>
        {/*   <Image
            src={productById.image}
            alt={productById.title}
            width={400}
            height={300}
            priority={true}
            className="border-none object-contain w-[400px] h-[300px] transition-transform transform hover:scale-110"
          /> */}
          <p>Calificación: {review.rating}</p>
          <p>Comentario: {review.comment}</p>
          <p>Fecha de creación: {review.created}</p>
          
        </div>
      )}
    </div>
  );
};

export default ReviewUsuario;