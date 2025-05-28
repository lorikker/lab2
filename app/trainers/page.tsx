"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  HeartIcon,
  ComputerDesktopIcon,
  UserGroupIcon,
  ClipboardDocumentListIcon,
  StarIcon,
  ClockIcon,
  CurrencyDollarIcon,
  PlusIcon
} from "@heroicons/react/24/outline";

const trainerCategories = [
  {
    id: "diet",
    name: "Diet & Nutrition",
    description: "Expert nutritionists to help you achieve your dietary goals",
    icon: HeartIcon,
    color: "from-gray-700 to-gray-800",
    trainers: [
      {
        id: 1,
        name: "Sarah Johnson",
        specialty: "Weight Loss Nutrition",
        experience: "5 years",
        rating: 4.9,
        price: "$80/session",
        image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop&crop=face",
        description: "Certified nutritionist with 5+ years helping clients achieve sustainable weight loss through personalized meal plans and lifestyle changes."
      },
      {
        id: 2,
        name: "Mike Chen",
        specialty: "Sports Nutrition",
        experience: "7 years",
        rating: 4.8,
        price: "$90/session",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
        description: "Sports nutrition specialist working with professional athletes and fitness enthusiasts to optimize performance through targeted nutrition strategies."
      }
    ]
  },
  {
    id: "online",
    name: "Online Training",
    description: "Virtual personal training sessions from anywhere",
    icon: ComputerDesktopIcon,
    color: "from-gray-600 to-gray-700",
    trainers: [
      {
        id: 3,
        name: "Emma Wilson",
        specialty: "Virtual Fitness Coaching",
        experience: "4 years",
        rating: 4.7,
        price: "$60/session",
        image: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&h=400&fit=crop&crop=face",
        description: "Virtual fitness coach specializing in home workouts, online motivation, and creating effective exercise routines for busy professionals."
      },
      {
        id: 4,
        name: "David Rodriguez",
        specialty: "Remote Strength Training",
        experience: "6 years",
        rating: 4.9,
        price: "$75/session",
        image: "https://images.unsplash.com/photo-1605296867304-46d5465a13f1?w=400&h=400&fit=crop&crop=face",
        description: "Remote strength training expert helping clients build muscle and strength using minimal equipment in home gym setups."
      }
    ]
  },
  {
    id: "physical",
    name: "Physical Training",
    description: "In-person training at our state-of-the-art facility",
    icon: UserGroupIcon,
    color: "from-[#2A2A2A] to-gray-700",
    trainers: [
      {
        id: 5,
        name: "Alex Thompson",
        specialty: "Strength & Conditioning",
        experience: "8 years",
        rating: 5.0,
        price: "$100/session",
        image: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=400&h=400&fit=crop&crop=face",
        description: "Elite strength and conditioning coach with 8+ years training professional athletes, powerlifters, and serious fitness enthusiasts."
      },
      {
        id: 6,
        name: "Lisa Martinez",
        specialty: "Functional Fitness",
        experience: "5 years",
        rating: 4.8,
        price: "$85/session",
        image: "https://images.unsplash.com/photo-1594381898411-846e7d193883?w=400&h=400&fit=crop&crop=face",
        description: "Functional fitness specialist focusing on real-world movement patterns, mobility, and injury prevention for everyday activities."
      }
    ]
  },
  {
    id: "programs",
    name: "Workout Programs",
    description: "Structured workout programs tailored to your goals",
    icon: ClipboardDocumentListIcon,
    color: "from-gray-800 to-[#2A2A2A]",
    trainers: [
      {
        id: 7,
        name: "Ryan Foster",
        specialty: "Program Design",
        experience: "6 years",
        rating: 4.9,
        price: "$120/program",
        image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
        description: "Program design specialist creating comprehensive, science-based workout plans tailored to individual goals, from beginner to advanced levels."
      },
      {
        id: 8,
        name: "Jessica Kim",
        specialty: "HIIT Programs",
        experience: "4 years",
        rating: 4.7,
        price: "$95/program",
        image: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=400&h=400&fit=crop&crop=face",
        description: "HIIT specialist designing high-intensity interval training programs that maximize fat loss and cardiovascular fitness in minimal time."
      }
    ]
  }
];

export default function TrainersPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [approvedTrainers, setApprovedTrainers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const trainersPerPage = 4; // Show 4 trainers per page (1 row of 4)

  // Fetch approved trainers from database
  useEffect(() => {
    const fetchApprovedTrainers = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('/api/trainers');
        if (response.ok) {
          const data = await response.json();
          console.log('Fetched trainers:', data);
          setApprovedTrainers(data.trainers || []);
        }
      } catch (error) {
        console.error('Error fetching approved trainers:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchApprovedTrainers();
  }, []);

  // Combine default trainers with approved trainers
  const getAllTrainers = () => {
    const defaultTrainers = trainerCategories.flatMap(cat => cat.trainers);
    return [...defaultTrainers, ...approvedTrainers];
  };

  // Filter trainers by category
  const getTrainersByCategory = (categoryId: string) => {
    const allTrainers = getAllTrainers();
    console.log('All trainers:', allTrainers);
    console.log('Filtering for category:', categoryId);

    // Map specialties to categories
    const categoryMapping: {[key: string]: string[]} = {
      'diet': ['Weight Loss Nutrition', 'Sports Nutrition', 'Clinical Nutrition', 'Meal Planning', 'Healthy Eating Coaching'],
      'online': ['Virtual Fitness Coaching', 'Remote Strength Training', 'Online Cardio Training', 'Virtual Yoga', 'Online HIIT Training'],
      'physical': ['Strength & Conditioning', 'Functional Fitness', 'Personal Training', 'Group Fitness', 'CrossFit Training'],
      'programs': ['Program Design', 'HIIT Programs', 'Bodybuilding Programs', 'CrossFit Programs', 'Yoga & Flexibility', 'Cardio Training']
    };

    const categorySpecialties = categoryMapping[categoryId] || [];

    const filtered = allTrainers.filter(trainer => {
      // For approved trainers from database, check category directly
      if (trainer.category) {
        return trainer.category === categoryId;
      }
      // For default trainers, check specialty
      return categorySpecialties.includes(trainer.specialty);
    });

    console.log('Filtered trainers for', categoryId, ':', filtered);
    return filtered;
  };

  const allFilteredTrainers = selectedCategory
    ? getTrainersByCategory(selectedCategory)
    : [];

  // Reset to page 1 when category changes
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory]);

  // Calculate pagination
  const totalPages = Math.ceil(allFilteredTrainers.length / trainersPerPage);
  const startIndex = (currentPage - 1) * trainersPerPage;
  const endIndex = startIndex + trainersPerPage;
  const filteredTrainers = allFilteredTrainers.slice(startIndex, endIndex);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#2A2A2A] via-[#2A2A2A] to-gray-800 pt-20">
        <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-transparent"></div>
        <div className="relative container mx-auto px-4 py-20">
          <div className="text-center max-w-5xl mx-auto">
            <h1 className="text-6xl md:text-7xl font-bold text-white mb-8 leading-tight">
              Meet Our <span className="text-[#D5FC51] relative">
                Expert Trainers
                <div className="absolute -bottom-2 left-0 w-full h-1 bg-[#D5FC51] rounded-full"></div>
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-[#D9D9D9] mb-10 leading-relaxed max-w-4xl mx-auto">
              Transform your fitness journey with our certified professionals. Each trainer brings unique expertise
              and passion to help you achieve your goals.
            </p>

            {/* Features */}
            <div className="flex flex-wrap justify-center items-center gap-6 mb-10 text-[#D9D9D9]">
              <div className="flex items-center bg-white/10 rounded-full px-4 py-2 backdrop-blur-sm">
                <div className="w-3 h-3 bg-[#D5FC51] rounded-full mr-2"></div>
                <span className="font-medium">Certified Professionals</span>
              </div>
              <div className="flex items-center bg-white/10 rounded-full px-4 py-2 backdrop-blur-sm">
                <div className="w-3 h-3 bg-[#D5FC51] rounded-full mr-2"></div>
                <span className="font-medium">Personalized Training</span>
              </div>
              <div className="flex items-center bg-white/10 rounded-full px-4 py-2 backdrop-blur-sm">
                <div className="w-3 h-3 bg-[#D5FC51] rounded-full mr-2"></div>
                <span className="font-medium">Proven Results</span>
              </div>
            </div>

            <div className="flex justify-center">
              <Link
                href="/trainers/apply"
                className="inline-flex items-center bg-[#D5FC51] text-[#2A2A2A] font-bold py-4 px-8 rounded-2xl hover:bg-[#D5FC51]/90 transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl border-2 border-transparent hover:border-white/20"
              >
                <PlusIcon className="h-6 w-6 mr-3" />
                Become a Trainer
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Categories Section */}
      <div id="categories-section" className="bg-[#FFFFFF] py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-[#2A2A2A] mb-6">
              Choose Your <span className="text-[#D5FC51]">Training Style</span>
            </h2>
            <p className="text-xl text-[#2A2A2A]/70 max-w-3xl mx-auto leading-relaxed">
              Select a category to explore our specialized trainers and find the perfect match for your fitness journey.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
            {trainerCategories.map((category) => {
              const IconComponent = category.icon;
              return (
                <div
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`relative group cursor-pointer transform transition-all duration-300 hover:scale-105 ${
                    selectedCategory === category.id ? 'scale-105' : ''
                  }`}
                >
                  <div className={`bg-gradient-to-br from-[#2A2A2A] to-gray-800 p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 border-2 ${
                    selectedCategory === category.id ? 'border-[#D5FC51]' : 'border-transparent hover:border-[#D9D9D9]/30'
                  }`}>
                    <div className="text-center">
                      <div className="bg-[#D5FC51]/20 rounded-full p-5 w-20 h-20 mx-auto mb-6 flex items-center justify-center group-hover:bg-[#D5FC51]/30 transition-all duration-300">
                        <IconComponent className="h-10 w-10 text-[#D5FC51]" />
                      </div>
                      <h3 className="text-xl font-bold text-white mb-3">{category.name}</h3>
                      <p className="text-[#D9D9D9] text-sm leading-relaxed">{category.description}</p>
                    </div>
                    {selectedCategory === category.id && (
                      <div className="absolute inset-0 bg-[#D5FC51]/5 rounded-3xl"></div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Trainers Display */}
      {selectedCategory && (
        <div className="bg-[#D9D9D9]/30 py-20">
          <div className="container mx-auto px-4">
            <div className="animate-fadeIn">
              <div className="text-center mb-12">
                <h3 className="text-3xl md:text-4xl font-bold text-[#2A2A2A] mb-4">
                  {trainerCategories.find(cat => cat.id === selectedCategory)?.name} <span className="text-[#D5FC51]">Specialists</span>
                </h3>
                <p className="text-[#2A2A2A]/70 text-lg mb-4">
                  {trainerCategories.find(cat => cat.id === selectedCategory)?.description}
                </p>
                <p className="text-[#2A2A2A]/50 text-sm">
                  Showing {filteredTrainers.length} of {allFilteredTrainers.length} trainer{allFilteredTrainers.length !== 1 ? 's' : ''}
                  {totalPages > 1 && ` (Page ${currentPage} of ${totalPages})`}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {filteredTrainers.map((trainer) => (
                  <div key={trainer.id} className="bg-white rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 group hover:scale-105 flex flex-col h-full border border-[#D9D9D9]/30">
                    <div className="relative">
                      <img
                        src={trainer.photoUrl || trainer.image || 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop&crop=face'}
                        alt={trainer.name}
                        className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute top-4 right-4 bg-[#2A2A2A]/90 rounded-full px-3 py-1 flex items-center backdrop-blur-sm">
                        <StarIcon className="h-4 w-4 text-[#D5FC51] mr-1" />
                        <span className="text-white text-sm font-medium">{trainer.rating || 5.0}</span>
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>

                    <div className="p-6 flex flex-col flex-grow">
                      <h4 className="text-xl font-bold text-[#2A2A2A] mb-2">{trainer.name}</h4>
                      <p className="text-[#D5FC51] font-semibold mb-3">{trainer.specialty}</p>
                      <p className="text-[#2A2A2A]/70 text-sm mb-6 flex-grow min-h-[3rem] leading-relaxed">{trainer.description || 'Professional trainer with extensive experience in fitness and wellness.'}</p>

                      <div className="flex items-center justify-between mb-6 p-3 bg-[#D9D9D9]/40 rounded-xl">
                        <div className="flex items-center text-[#2A2A2A]/70">
                          <ClockIcon className="h-4 w-4 mr-2 text-[#D5FC51]" />
                          <span className="text-sm font-medium">{trainer.experience} {trainer.experience?.includes('years') ? '' : 'years'}</span>
                        </div>
                        <div className="flex items-center text-[#2A2A2A]">
                          <CurrencyDollarIcon className="h-4 w-4 mr-1 text-[#D5FC51]" />
                          <span className="font-bold">${trainer.price?.replace('$', '').replace('/session', '')}/session</span>
                        </div>
                      </div>

                      <Link
                        href={`/trainers/book/${trainer.id}?category=${selectedCategory}`}
                        className="w-full bg-[#D5FC51] text-[#2A2A2A] font-bold py-4 px-6 rounded-2xl hover:bg-[#D5FC51]/90 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl block text-center mt-auto border-2 border-transparent hover:border-[#2A2A2A]/10"
                      >
                        Book Now
                      </Link>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center mt-16 space-x-3">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                      currentPage === 1
                        ? 'bg-[#D9D9D9]/30 text-[#2A2A2A]/50 cursor-not-allowed'
                        : 'bg-[#2A2A2A] text-white hover:bg-[#2A2A2A]/80 hover:scale-105 shadow-lg'
                    }`}
                  >
                    Previous
                  </button>

                  <div className="flex space-x-2">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`px-4 py-3 rounded-xl font-medium transition-all duration-300 ${
                          currentPage === page
                            ? 'bg-[#D5FC51] text-[#2A2A2A] shadow-lg'
                            : 'bg-[#2A2A2A] text-white hover:bg-[#2A2A2A]/80 hover:scale-105'
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                      currentPage === totalPages
                        ? 'bg-[#D9D9D9]/30 text-[#2A2A2A]/50 cursor-not-allowed'
                        : 'bg-[#2A2A2A] text-white hover:bg-[#2A2A2A]/80 hover:scale-105 shadow-lg'
                    }`}
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Call to Action when no category selected */}
      {!selectedCategory && (
        <div className="bg-gradient-to-br from-[#2A2A2A] via-[#2A2A2A] to-gray-800 py-20">
          <div className="container mx-auto px-4 text-center">
            <h3 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to Start Your <span className="text-[#D5FC51]">Journey?</span>
            </h3>
            <p className="text-xl text-[#D9D9D9] mb-10 max-w-3xl mx-auto leading-relaxed">
              Select a training category above to browse our expert trainers and book your first session today.
            </p>
            <button
              onClick={() => {
                const categoriesSection = document.getElementById('categories-section');
                categoriesSection?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="bg-[#D5FC51] text-[#2A2A2A] font-bold py-4 px-10 rounded-2xl inline-block hover:bg-[#D5FC51]/90 transition-all duration-300 cursor-pointer transform hover:scale-105 shadow-xl hover:shadow-2xl border-2 border-transparent hover:border-white/20"
            >
              Choose Your Training Style ↑
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
