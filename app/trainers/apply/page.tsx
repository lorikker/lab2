"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

export default function TrainerApplicationPage() {
  const { data: session } = useSession();
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    category: '', // New field for trainer category
    specialty: '',
    experience: '',
    price: '',
    description: '',
    qualifications: '',
    availability: '',
    photoUrl: ''
  });

  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Trainer categories with their specialties
  const trainerCategories = {
    'diet': {
      name: 'Diet & Nutrition',
      description: 'Nutritionists and diet specialists',
      specialties: ['Weight Loss Nutrition', 'Sports Nutrition', 'Clinical Nutrition', 'Meal Planning', 'Healthy Eating Coaching']
    },
    'online': {
      name: 'Online Training',
      description: 'Virtual personal training and coaching',
      specialties: ['Virtual Fitness Coaching', 'Remote Strength Training', 'Online Cardio Training', 'Online HIIT Training']
    },
    'physical': {
      name: 'Physical Training',
      description: 'In-person training at our facility',
      specialties: ['Strength & Conditioning', 'Functional Fitness', 'Personal Training', 'Group Fitness', 'CrossFit Training']
    },
    'programs': {
      name: 'Workout Programs',
      description: 'Structured workout program designers',
      specialties: ['Program Design', 'HIIT Programs', 'Bodybuilding Programs', 'CrossFit Programs']
    }
  };

  // Get specialties based on selected category
  const getSpecialtiesForCategory = (category: string) => {
    return trainerCategories[category as keyof typeof trainerCategories]?.specialties || [];
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    // If category changes, reset specialty
    if (name === 'category') {
      setFormData(prev => ({
        ...prev,
        [name]: value,
        specialty: '' // Reset specialty when category changes
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone is required';
    if (!formData.category) newErrors.category = 'Trainer category is required';
    if (!formData.specialty) newErrors.specialty = 'Specialty is required';
    if (!formData.experience.trim()) newErrors.experience = 'Experience is required';
    if (!formData.price.trim()) newErrors.price = 'Price is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.qualifications.trim()) newErrors.qualifications = 'Qualifications are required';
    if (!formData.availability.trim()) newErrors.availability = 'Availability is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!session) {
      alert('You must be logged in to apply as a trainer');
      router.push('/login');
      return;
    }

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/trainer-applications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          userId: session.user?.id || session.user?.email,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit application');
      }

      setIsSubmitted(true);

    } catch (error) {
      console.error('Application error:', error);
      alert('Failed to submit application. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#2A2A2A] via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 max-w-md mx-auto text-center">
          <div className="w-16 h-16 bg-[#D5FC51] rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white mb-4">Application Submitted!</h1>
          <p className="text-gray-300 mb-6">
            Thank you for applying to become a trainer at SixStar Fitness. Your application has been submitted and is now under review by our admin team.
          </p>
          <p className="text-gray-400 text-sm mb-6">
            You will receive an email notification once your application has been reviewed.
          </p>
          <div className="space-y-3">
            <Link
              href="/trainers"
              className="w-full bg-[#D5FC51] text-black font-bold py-3 px-6 rounded-xl hover:bg-[#D5FC51]/90 transition-all duration-300 block text-center"
            >
              View Trainers
            </Link>
            <Link
              href="/dashboard"
              className="w-full bg-gray-700 text-white font-bold py-3 px-6 rounded-xl hover:bg-gray-600 transition-all duration-300 block text-center"
            >
              Go to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#2A2A2A] via-gray-800 to-gray-900 pt-20">
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Link
          href="/trainers"
          className="inline-flex items-center text-[#D5FC51] hover:text-green-400 transition-colors mb-8"
        >
          <ArrowLeftIcon className="h-5 w-5 mr-2" />
          Back to Trainers
        </Link>

        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-white mb-2 text-center">
            Apply to Become a Trainer
          </h1>
          <p className="text-gray-300 text-center mb-8">
            Join our team of professional trainers at SixStar Fitness
          </p>

          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Information */}
              <div>
                <h2 className="text-xl font-bold text-white mb-4">Personal Information</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-white text-sm font-medium mb-2">Full Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className={`w-full p-3 rounded-xl bg-gray-700 border ${errors.name ? 'border-red-500' : 'border-gray-600'} text-white focus:border-[#D5FC51] focus:outline-none`}
                      placeholder="John Doe"
                    />
                    {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                  </div>
                  <div>
                    <label className="block text-white text-sm font-medium mb-2">Email *</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`w-full p-3 rounded-xl bg-gray-700 border ${errors.email ? 'border-red-500' : 'border-gray-600'} text-white focus:border-[#D5FC51] focus:outline-none`}
                      placeholder="john@example.com"
                    />
                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-white text-sm font-medium mb-2">Phone Number *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className={`w-full p-3 rounded-xl bg-gray-700 border ${errors.phone ? 'border-red-500' : 'border-gray-600'} text-white focus:border-[#D5FC51] focus:outline-none`}
                    placeholder="+1 (555) 123-4567"
                  />
                  {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                </div>
              </div>

              {/* Professional Information */}
              <div>
                <h2 className="text-xl font-bold text-white mb-4">Professional Information</h2>

                <div className="mb-4">
                  <label className="block text-white text-sm font-medium mb-2">Trainer Category *</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className={`w-full p-3 rounded-xl bg-gray-700 border ${errors.category ? 'border-red-500' : 'border-gray-600'} text-white focus:border-[#D5FC51] focus:outline-none`}
                  >
                    <option value="">Select trainer category</option>
                    {Object.entries(trainerCategories).map(([key, category]) => (
                      <option key={key} value={key}>{category.name} - {category.description}</option>
                    ))}
                  </select>
                  {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-white text-sm font-medium mb-2">Specialty *</label>
                    <select
                      name="specialty"
                      value={formData.specialty}
                      onChange={handleInputChange}
                      disabled={!formData.category}
                      className={`w-full p-3 rounded-xl bg-gray-700 border ${errors.specialty ? 'border-red-500' : 'border-gray-600'} text-white focus:border-[#D5FC51] focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      <option value="">
                        {formData.category ? 'Select your specialty' : 'First select a category'}
                      </option>
                      {getSpecialtiesForCategory(formData.category).map(specialty => (
                        <option key={specialty} value={specialty}>{specialty}</option>
                      ))}
                    </select>
                    {errors.specialty && <p className="text-red-500 text-sm mt-1">{errors.specialty}</p>}
                  </div>
                  <div>
                    <label className="block text-white text-sm font-medium mb-2">Experience *</label>
                    <input
                      type="text"
                      name="experience"
                      value={formData.experience}
                      onChange={handleInputChange}
                      className={`w-full p-3 rounded-xl bg-gray-700 border ${errors.experience ? 'border-red-500' : 'border-gray-600'} text-white focus:border-[#D5FC51] focus:outline-none`}
                      placeholder="5 years"
                    />
                    {errors.experience && <p className="text-red-500 text-sm mt-1">{errors.experience}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-white text-sm font-medium mb-2">Session Price *</label>
                  <input
                    type="text"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    className={`w-full p-3 rounded-xl bg-gray-700 border ${errors.price ? 'border-red-500' : 'border-gray-600'} text-white focus:border-[#D5FC51] focus:outline-none`}
                    placeholder="$80/session"
                  />
                  {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
                </div>

                <div>
                  <label className="block text-white text-sm font-medium mb-2">Description *</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={4}
                    className={`w-full p-3 rounded-xl bg-gray-700 border ${errors.description ? 'border-red-500' : 'border-gray-600'} text-white focus:border-[#D5FC51] focus:outline-none`}
                    placeholder="Describe your training approach and what makes you unique..."
                  />
                  {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
                </div>

                <div>
                  <label className="block text-white text-sm font-medium mb-2">Qualifications & Certifications *</label>
                  <textarea
                    name="qualifications"
                    value={formData.qualifications}
                    onChange={handleInputChange}
                    rows={3}
                    className={`w-full p-3 rounded-xl bg-gray-700 border ${errors.qualifications ? 'border-red-500' : 'border-gray-600'} text-white focus:border-[#D5FC51] focus:outline-none`}
                    placeholder="List your certifications, education, and relevant qualifications..."
                  />
                  {errors.qualifications && <p className="text-red-500 text-sm mt-1">{errors.qualifications}</p>}
                </div>

                <div>
                  <label className="block text-white text-sm font-medium mb-2">Availability *</label>
                  <textarea
                    name="availability"
                    value={formData.availability}
                    onChange={handleInputChange}
                    rows={3}
                    className={`w-full p-3 rounded-xl bg-gray-700 border ${errors.availability ? 'border-red-500' : 'border-gray-600'} text-white focus:border-[#D5FC51] focus:outline-none`}
                    placeholder="Describe your available days and hours (e.g., Mon-Fri 9AM-6PM, Weekends 10AM-4PM)..."
                  />
                  {errors.availability && <p className="text-red-500 text-sm mt-1">{errors.availability}</p>}
                </div>

                <div>
                  <label className="block text-white text-sm font-medium mb-2">Profile Photo URL (Optional)</label>
                  <input
                    type="url"
                    name="photoUrl"
                    value={formData.photoUrl}
                    onChange={handleInputChange}
                    className="w-full p-3 rounded-xl bg-gray-700 border border-gray-600 text-white focus:border-[#D5FC51] focus:outline-none"
                    placeholder="https://example.com/your-photo.jpg"
                  />
                  <p className="text-gray-400 text-sm mt-1">
                    Provide a professional photo URL. If left empty, a default photo will be used.
                  </p>
                </div>
              </div>

              <div className="bg-gray-700/50 rounded-xl p-4">
                <h3 className="text-lg font-bold text-white mb-2">Application Review Process</h3>
                <ul className="text-gray-300 text-sm space-y-1">
                  <li>• Your application will be reviewed by our admin team</li>
                  <li>• You will receive an email notification with the decision</li>
                  <li>• Approved trainers will be added to our trainers page</li>
                  <li>• The review process typically takes 2-3 business days</li>
                </ul>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-4 px-6 rounded-xl font-bold text-lg transition-all duration-300 ${
                  isLoading
                    ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                    : "bg-[#D5FC51] text-black hover:bg-[#D5FC51]/90 transform hover:scale-105 shadow-lg hover:shadow-xl"
                }`}
              >
                {isLoading ? "Submitting Application..." : "Submit Application"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
