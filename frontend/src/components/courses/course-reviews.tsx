import React, { useState, useEffect } from 'react';
import { reviewsAPI } from '../../lib/api';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Textarea } from '../ui/textarea';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import {
  Star,
  ThumbsUp,
  ThumbsDown,
  User,
  MessageSquare,
  Send,
  Edit,
  Trash2
} from 'lucide-react';
import { toast } from '../ui/use-toast';

interface Review {
  id: string;
  userId: string;
  courseId: string;
  rating: number;
  title?: string;
  comment?: string;
  pros?: string[];
  cons?: string[];
  isVisible: boolean;
  isVerified: boolean;
  helpful: number;
  unhelpful: number;
  createdAt: string;
  updatedAt: string;
  user?: {
    id: string;
    firstName: string;
    lastName: string;
    profilePicture?: string;
  };
}

interface CourseReviewsProps {
  courseId: string;
}

export const CourseReviews: React.FC<CourseReviewsProps> = ({ courseId }) => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [formData, setFormData] = useState({
    rating: 5,
    title: '',
    comment: '',
    pros: [''],
    cons: [''],
  });

  useEffect(() => {
    loadReviews();
    loadStats();
  }, [courseId]);

  const loadReviews = async () => {
    try {
      const response = await reviewsAPI.getByCourse(courseId);
      if (response.success && response.data) {
        setReviews(response.data);
      }
    } catch (error) {
      console.error('Error loading reviews:', error);
    }
  };

  const loadStats = async () => {
    try {
      const response = await reviewsAPI.getCourseStats(courseId);
      if (response.success && response.data) {
        setStats(response.data);
      }
    } catch (error) {
      console.error('Error loading review stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const reviewData = {
        courseId,
        rating: formData.rating,
        title: formData.title || undefined,
        comment: formData.comment || undefined,
        pros: formData.pros.filter(p => p.trim()),
        cons: formData.cons.filter(c => c.trim()),
      };

      if (editingReview) {
        const response = await reviewsAPI.update(editingReview.id, reviewData);
        if (response.success) {
          toast({
            title: 'Success',
            description: 'Review updated successfully',
          });
        }
      } else {
        const response = await reviewsAPI.create(reviewData);
        if (response.success) {
          toast({
            title: 'Success',
            description: 'Review submitted successfully',
          });
        }
      }

      resetForm();
      loadReviews();
      loadStats();
    } catch (error) {
      console.error('Error saving review:', error);
      toast({
        title: 'Error',
        description: 'Failed to save review',
        variant: 'destructive',
      });
    }
  };

  const handleVote = async (reviewId: string, type: 'helpful' | 'unhelpful') => {
    if (!user) {
      toast({
        title: 'Please login',
        description: 'You must be logged in to vote on reviews',
        variant: 'destructive',
      });
      return;
    }

    try {
      const response = await reviewsAPI.vote(reviewId, type);
      if (response.success) {
        loadReviews();
        toast({
          title: 'Success',
          description: 'Vote recorded successfully',
        });
      }
    } catch (error) {
      console.error('Error voting:', error);
      toast({
        title: 'Error',
        description: 'Failed to record vote',
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async (reviewId: string) => {
    if (!confirm('Are you sure you want to delete this review?')) return;

    try {
      const response = await reviewsAPI.delete(reviewId);
      if (response.success) {
        toast({
          title: 'Success',
          description: 'Review deleted successfully',
        });
        loadReviews();
        loadStats();
      }
    } catch (error) {
      console.error('Error deleting review:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete review',
        variant: 'destructive',
      });
    }
  };

  const resetForm = () => {
    setFormData({
      rating: 5,
      title: '',
      comment: '',
      pros: [''],
      cons: [''],
    });
    setEditingReview(null);
    setShowReviewForm(false);
  };

  const startEdit = (review: Review) => {
    setEditingReview(review);
    setFormData({
      rating: review.rating,
      title: review.title || '',
      comment: review.comment || '',
      pros: review.pros || [''],
      cons: review.cons || [''],
    });
    setShowReviewForm(true);
  };

  const addPro = () => {
    setFormData(prev => ({ ...prev, pros: [...prev.pros, ''] }));
  };

  const addCon = () => {
    setFormData(prev => ({ ...prev, cons: [...prev.cons, ''] }));
  };

  const updatePro = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      pros: prev.pros.map((p, i) => i === index ? value : p)
    }));
  };

  const updateCon = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      cons: prev.cons.map((c, i) => i === index ? value : c)
    }));
  };

  const removePro = (index: number) => {
    setFormData(prev => ({
      ...prev,
      pros: prev.pros.filter((_, i) => i !== index)
    }));
  };

  const removeCon = (index: number) => {
    setFormData(prev => ({
      ...prev,
      cons: prev.cons.filter((_, i) => i !== index)
    }));
  };

  if (loading) {
    return <div className="text-center py-8">Loading reviews...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Review Stats */}
      {stats && (
        <Card>
          <CardHeader>
            <CardTitle>Review Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-500">
                  {stats.averageRating}
                </div>
                <div className="flex justify-center mb-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-4 w-4 ${star <= Math.floor(stats.averageRating)
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300'
                        }`}
                    />
                  ))}
                </div>
                <div className="text-sm text-gray-600">
                  Based on {stats.totalReviews} reviews
                </div>
              </div>

              <div className="col-span-2">
                <div className="space-y-1">
                  {[5, 4, 3, 2, 1].map((rating) => (
                    <div key={rating} className="flex items-center gap-2">
                      <span className="text-sm w-8">{rating} star</span>
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-yellow-400 h-2 rounded-full"
                          style={{
                            width: `${stats.totalReviews > 0 ? (stats.ratingDistribution[rating] / stats.totalReviews) * 100 : 0}%`
                          }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-600 w-8">
                        {stats.ratingDistribution[rating] || 0}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Write Review Button */}
      {user && !showReviewForm && (
        <div className="text-center">
          <Button onClick={() => setShowReviewForm(true)}>
            <MessageSquare className="h-4 w-4 mr-2" />
            Write a Review
          </Button>
        </div>
      )}

      {/* Review Form */}
      {showReviewForm && (
        <Card>
          <CardHeader>
            <CardTitle>
              {editingReview ? 'Edit Review' : 'Write a Review'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Rating */}
              <div>
                <Label>Rating</Label>
                <div className="flex gap-1 mt-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, rating: star }))}
                      className="focus:outline-none"
                    >
                      <Star
                        className={`h-6 w-6 ${star <= formData.rating
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300'
                          }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Title */}
              <div>
                <Label htmlFor="title">Review Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Summarize your review"
                />
              </div>

              {/* Comment */}
              <div>
                <Label htmlFor="comment">Your Review</Label>
                <Textarea
                  id="comment"
                  value={formData.comment}
                  onChange={(e) => setFormData(prev => ({ ...prev, comment: e.target.value }))}
                  placeholder="Share your thoughts about this course..."
                  rows={4}
                />
              </div>

              {/* Pros */}
              <div>
                <Label>What did you like? (Optional)</Label>
                {formData.pros.map((pro, index) => (
                  <div key={index} className="flex gap-2 mt-1">
                    <Input
                      value={pro}
                      onChange={(e) => updatePro(index, e.target.value)}
                      placeholder="What was good?"
                    />
                    {formData.pros.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removePro(index)}
                      >
                        Remove
                      </Button>
                    )}
                  </div>
                ))}
                <Button type="button" variant="outline" onClick={addPro} className="mt-2">
                  + Add Pro
                </Button>
              </div>

              {/* Cons */}
              <div>
                <Label>What could be improved? (Optional)</Label>
                {formData.cons.map((con, index) => (
                  <div key={index} className="flex gap-2 mt-1">
                    <Input
                      value={con}
                      onChange={(e) => updateCon(index, e.target.value)}
                      placeholder="What could be better?"
                    />
                    {formData.cons.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeCon(index)}
                      >
                        Remove
                      </Button>
                    )}
                  </div>
                ))}
                <Button type="button" variant="outline" onClick={addCon} className="mt-2">
                  + Add Con
                </Button>
              </div>

              {/* Form Actions */}
              <div className="flex gap-2">
                <Button type="submit">
                  <Send className="h-4 w-4 mr-2" />
                  {editingReview ? 'Update Review' : 'Submit Review'}
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.map((review) => (
          <Card key={review.id}>
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                    {review.user?.profilePicture ? (
                      <img
                        src={review.user.profilePicture}
                        alt="Profile"
                        className="w-10 h-10 rounded-full"
                      />
                    ) : (
                      <User className="h-5 w-5 text-gray-500" />
                    )}
                  </div>
                  <div>
                    <div className="font-medium">
                      {review.user
                        ? `${review.user.firstName} ${review.user.lastName}`
                        : 'Anonymous User'
                      }
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`h-4 w-4 ${star <= review.rating
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-gray-300'
                              }`}
                          />
                        ))}
                      </div>
                      {review.isVerified && (
                        <Badge variant="secondary" className="text-xs">
                          Verified Purchase
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>

                {user && user.id === review.userId && (
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => startEdit(review)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(review.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>

              {review.title && (
                <h4 className="font-semibold mb-2">{review.title}</h4>
              )}

              {review.comment && (
                <p className="text-gray-700 mb-4">{review.comment}</p>
              )}

              {/* Pros and Cons */}
              {(review.pros?.length > 0 || review.cons?.length > 0) && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  {review.pros && review.pros.length > 0 && (
                    <div>
                      <h5 className="font-medium text-green-600 mb-2">What students liked:</h5>
                      <ul className="list-disc list-inside space-y-1 text-sm">
                        {review.pros.map((pro, index) => (
                          <li key={index} className="text-gray-600">{pro}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {review.cons && review.cons.length > 0 && (
                    <div>
                      <h5 className="font-medium text-orange-600 mb-2">What could be improved:</h5>
                      <ul className="list-disc list-inside space-y-1 text-sm">
                        {review.cons.map((con, index) => (
                          <li key={index} className="text-gray-600">{con}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {/* Review Actions */}
              <div className="flex justify-between items-center text-sm text-gray-500">
                <span>{new Date(review.createdAt).toLocaleDateString()}</span>

                <div className="flex items-center gap-4">
                  <span>{review.helpful} helpful</span>
                  <div className="flex gap-1">
                    <button
                      onClick={() => handleVote(review.id, 'helpful')}
                      className="flex items-center gap-1 hover:text-green-600"
                    >
                      <ThumbsUp className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleVote(review.id, 'unhelpful')}
                      className="flex items-center gap-1 hover:text-red-600"
                    >
                      <ThumbsDown className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {reviews.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No reviews yet</h3>
              <p className="text-gray-600 mb-4">
                Be the first to share your thoughts about this course!
              </p>
              {user && (
                <Button onClick={() => setShowReviewForm(true)}>
                  Write the First Review
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};