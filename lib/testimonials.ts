export interface Testimonial {
  id: string;
  name: string;
  position: string;
  company: string;
  image?: string;
  quote: string;
  rating: number;
  relationship: string;
  linkedInUrl?: string;
  date: string;
}

export const testimonials: Testimonial[] = [
  {
    id: '1',
    name: 'John Smith',
    position: 'CTO',
    company: 'Enterprise Solutions Inc.',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop',
    quote: 'Sanjay is an exceptional cloud architect who transformed our entire infrastructure. His expertise in Azure and microservices helped us reduce costs by 40% while improving system reliability to 99.9% uptime. He\'s not just technically brilliant but also an excellent communicator who can explain complex concepts to non-technical stakeholders.',
    rating: 5,
    relationship: 'Worked with Sanjay on the same team',
    linkedInUrl: 'https://linkedin.com',
    date: '2024-02-15',
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    position: 'Senior Product Manager',
    company: 'Tech Innovators LLC',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop',
    quote: 'Working with Sanjay on our real-time analytics platform was a game-changer. He built a system that processes millions of events per second with sub-second latency. His attention to detail and commitment to best practices set a high standard for the entire team. I would work with him again in a heartbeat.',
    rating: 5,
    relationship: 'Managed Sanjay directly',
    linkedInUrl: 'https://linkedin.com',
    date: '2023-11-20',
  },
  {
    id: '3',
    name: 'Michael Chen',
    position: 'Lead Developer',
    company: 'CloudTech Systems',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop',
    quote: 'Sanjay\'s deep knowledge of both frontend and backend technologies makes him a true full-stack expert. He mentored our team on React best practices and helped us implement a scalable microservices architecture. His code reviews were always insightful and helped elevate our entire codebase quality.',
    rating: 5,
    relationship: 'Worked with Sanjay on the same team',
    linkedInUrl: 'https://linkedin.com',
    date: '2023-09-10',
  },
  {
    id: '4',
    name: 'Emily Rodriguez',
    position: 'DevOps Engineer',
    company: 'Digital Solutions Co.',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop',
    quote: 'Sanjay revolutionized our CI/CD pipeline and cloud infrastructure. His implementation of Infrastructure as Code and automated deployment strategies reduced our deployment time from hours to minutes. He\'s a problem solver who always finds elegant solutions to complex challenges.',
    rating: 5,
    relationship: 'Worked with Sanjay on the same team',
    date: '2023-07-05',
  },
  {
    id: '5',
    name: 'David Park',
    position: 'Engineering Manager',
    company: 'Innovation Labs',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop',
    quote: 'Sanjay is one of the most talented engineers I\'ve had the pleasure of working with. His ability to architect scalable systems while maintaining clean, maintainable code is impressive. He consistently delivers high-quality work on time and is always willing to help teammates overcome technical challenges.',
    rating: 5,
    relationship: 'Managed Sanjay directly',
    linkedInUrl: 'https://linkedin.com',
    date: '2023-05-18',
  },
  {
    id: '6',
    name: 'Lisa Anderson',
    position: 'UX Designer',
    company: 'Creative Tech Studio',
    image: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=200&h=200&fit=crop',
    quote: 'As a designer, I appreciate how Sanjay bridges the gap between design and development. He implemented our complex UI designs pixel-perfectly while optimizing for performance. His collaborative approach and attention to user experience made our project a huge success.',
    rating: 5,
    relationship: 'Worked with Sanjay on the same team',
    date: '2023-03-22',
  },
];

export function getAllTestimonials(): Testimonial[] {
  return testimonials;
}

export function getFeaturedTestimonials(limit: number = 3): Testimonial[] {
  return testimonials.slice(0, limit);
}

export function getAverageRating(): number {
  const sum = testimonials.reduce((acc, t) => acc + t.rating, 0);
  return sum / testimonials.length;
}
