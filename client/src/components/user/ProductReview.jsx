export default function ProductReview({ reviews = [  {
    userName: "Rahul Kumar",
    userPic: "https://randomuser.me/api/portraits/men/32.jpg",
    rating: 5,
    comment: "Amazing product! The build quality is excellent and delivery was super fast.",
    date: "2025-01-12"
  },
  {
    userName: "Ananya Sharma",
    userPic: "https://randomuser.me/api/portraits/women/44.jpg",
    rating: 4,
    comment: "Very good quality. Slightly expensive but worth it overall.",
    date: "2025-02-04"
  },
  {
    userName: "Vikram Singh",
    userPic: "https://randomuser.me/api/portraits/men/15.jpg",
    rating: 3,
    comment: "Product is okay. Not exactly as shown in the image but workable.",
    date: "2025-03-21"
  },
  {
    userName: "Priya Nair",
    userPic: "https://randomuser.me/api/portraits/women/12.jpg",
    rating: 5,
    comment: "Loved it! Highly recommended. I will buy again.",
    date: "2025-03-29"
  }] }) {
  return (
    <div className="w-full mt-10 mb-20 ">
      <h2 className="text-xl font-bold mb-8">Customer Reviews</h2>

      <div className="flex flex-col gap-4">
        {reviews?.length === 0 ? (
          <p className="text-gray-500">No reviews yet.</p>
        ) : (
          reviews.map((review, index) => (
            <div
              key={index}
              className="flex items-start gap-4 bg-gray-100 rounded-xl p-5 text-xs shadow-sm"
            >
              {/* Profile Picture */}
              <img
                src={review?.userPic || "https://via.placeholder.com/50"}
                alt="User"
                className="w-12 h-12 rounded-full object-cover"
              />

              {/* Review Info */}
              <div className="flex flex-col">
                <p className="font-semibold text-gray-900">
                  {review?.userName || "Anonymous User"}
                </p>

                {/* Rating Stars */}
                <div className="flex gap-1 my-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span
                      key={star}
                      className={`text-yellow-500 text-lg ${
                        star <= review.rating ? "" : "text-gray-300"
                      }`}
                    >
                      ★
                    </span>
                  ))}
                </div>

                <p className="text-gray-700">{review.comment}</p>

                {review.date && (
                  <p className="text-gray-400 text-sm mt-1">
                    {new Date(review.date).toDateString()}
                  </p>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
