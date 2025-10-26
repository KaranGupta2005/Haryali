import { useState } from "react";
import { Star, MessageCircle } from "lucide-react";

const ReviewForm = () => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = () => {
    if (rating === 0) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setTimeout(() => {
        setRating(0);
        setComment("");
        setIsSubmitted(false);
      }, 2000);
    }, 1500);
  };

  if (isSubmitted) {
    return (
      <div className="p-8 rounded-2xl bg-gradient-to-br from-green-50 to-emerald-50 shadow-xl border border-green-200 max-w-md mx-auto">
        <div className="text-center">
          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              ></path>
            </svg>
          </div>
          <h3 className="text-xl font-bold text-green-800 mb-2">Thank You!</h3>
          <p className="text-green-600">
            Your feedback means the world to us ✨
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 rounded-2xl bg-white shadow-2xl border border-gray-200 max-w-md mx-auto backdrop-blur-sm">
      <div className="text-center mb-6">
        <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-3">
          <Star className="w-6 h-6 text-white" />
        </div>
        <h3 className="text-2xl font-bold bg-gradient-to-r from-green-500 to-emerald-500 bg-clip-text text-transparent mb-2">
          Rate Haryali
        </h3>
        <p className="text-gray-600 text-sm">Help us improve your experience</p>
      </div>

      {/* Star Rating */}
      <div className="flex justify-center mb-6 gap-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => setRating(star)}
            onMouseEnter={() => setHover(star)}
            onMouseLeave={() => setHover(0)}
            className="group transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-lime-400 rounded-full p-1"
          >
            <Star
              className={`w-8 h-8 transition-all duration-200 ${
                star <= (hover || rating)
                  ? "text-lime-400 fill-lime-400 drop-shadow-lg"
                  : "text-gray-300 group-hover:text-lime-300"
              }`}
            />
          </button>
        ))}
      </div>

      {/* Rating Feedback Text */}
      {rating > 0 && (
        <div className="text-center mb-4">
          <p className="text-sm font-medium text-gray-700">
            {rating === 5 && "🎉 Fantastic!"}
            {rating === 4 && "😊 Great!"}
            {rating === 3 && "👍 Good!"}
            {rating === 2 && "😐 Okay"}
            {rating === 1 && "😔 Needs improvement"}
          </p>
        </div>
      )}

      {/* Comment Box */}
      <div className="relative mb-6">
        <textarea
          className="w-full p-4 rounded-xl border-2 border-gray-200 bg-gray-50 text-gray-900 placeholder-gray-500 resize-none transition-all duration-200 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 focus:bg-white"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Share your thoughts... What did you love? What could be better?"
          rows={4}
          maxLength={500}
        />
        <div className="absolute bottom-3 right-3 text-xs text-gray-400">
          {comment.length}/500
        </div>
      </div>

      {/* Submit Button */}
      <button
        onClick={handleSubmit}
        disabled={rating === 0 || isSubmitting}
        className={`w-full py-4 px-6 rounded-xl font-semibold text-white transition-all duration-300 transform ${
          rating === 0
            ? "bg-gray-300 cursor-not-allowed"
            : "bg-gradient-to-r from-green-400 to-emerald-500 hover:from-green-500 hover:to-emerald-600 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]"
        }`}
      >
        {isSubmitting ? (
          <div className="flex items-center justify-center gap-2">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            Submitting...
          </div>
        ) : (
          <div className="flex items-center justify-center gap-2">
            <MessageCircle className="w-4 h-4" />
            Submit Review
          </div>
        )}
      </button>
    </div>
  );
};

export default ReviewForm;
