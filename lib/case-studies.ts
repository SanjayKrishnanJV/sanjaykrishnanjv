export interface CaseStudy {
  id: string;
  title: string;
  tagline: string;
  description: string;
  coverImage: string;
  gallery?: string[];
  category: string;
  tags: string[];
  timeline: {
    start: string;
    end: string;
    duration: string;
  };
  team?: {
    size: number;
    role: string;
  };
  technologies: {
    frontend?: string[];
    backend?: string[];
    database?: string[];
    infrastructure?: string[];
    tools?: string[];
  };
  challenge: {
    title: string;
    description: string;
    keyPoints: string[];
  };
  solution: {
    title: string;
    description: string;
    keyPoints: string[];
    architecture?: string;
  };
  outcomes: {
    title: string;
    metrics: {
      label: string;
      value: string;
      icon?: string;
    }[];
    testimonial?: {
      quote: string;
      author: string;
      position: string;
    };
  };
  features: string[];
  learnings?: string[];
  githubUrl?: string;
  liveUrl?: string;
  status: 'completed' | 'in-progress' | 'archived';
}

// Sample case studies - you can customize these based on your actual projects
export const caseStudies: CaseStudy[] = [
  {
    id: 'cloud-migration-platform',
    title: 'Enterprise Cloud Migration Platform',
    tagline: 'Seamlessly migrating legacy systems to Azure cloud infrastructure',
    description: 'Led the development of a comprehensive cloud migration platform that helped enterprise clients transition from on-premises infrastructure to Azure, reducing operational costs by 40% and improving system reliability.',
    coverImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&h=600&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=800&h=600&fit=crop',
    ],
    category: 'Cloud Architecture',
    tags: ['Azure', 'Cloud Migration', 'DevOps', 'Enterprise'],
    timeline: {
      start: '2023-01',
      end: '2023-12',
      duration: '12 months',
    },
    team: {
      size: 8,
      role: 'Lead Cloud Architect',
    },
    technologies: {
      backend: ['C#', '.NET Core', 'Azure Functions', 'Azure Service Bus'],
      database: ['Azure SQL Database', 'Cosmos DB', 'Redis Cache'],
      infrastructure: ['Azure DevOps', 'Azure Kubernetes Service', 'ARM Templates', 'Terraform'],
      tools: ['Docker', 'Kubernetes', 'Application Insights', 'Azure Monitor'],
    },
    challenge: {
      title: 'The Migration Challenge',
      description: 'The client had 15+ legacy applications running on aging on-premises servers with zero cloud experience. They needed a migration strategy that minimized downtime and risk.',
      keyPoints: [
        'Zero downtime requirement for critical applications',
        'Complex data dependencies between systems',
        'Limited cloud expertise in existing team',
        'Strict compliance and security requirements',
        'Budget constraints and timeline pressure',
      ],
    },
    solution: {
      title: 'Phased Migration Approach',
      description: 'We designed a comprehensive migration framework with automated assessment, containerization, and gradual cutover strategy.',
      keyPoints: [
        'Automated assessment tools to analyze application dependencies',
        'Containerized applications using Docker and AKS',
        'Implemented blue-green deployment for zero-downtime migration',
        'Created comprehensive monitoring and alerting system',
        'Built automated rollback mechanisms for risk mitigation',
        'Established cloud best practices and training program',
      ],
    },
    outcomes: {
      title: 'Measurable Impact',
      metrics: [
        { label: 'Cost Reduction', value: '40%', icon: 'TrendingDown' },
        { label: 'System Uptime', value: '99.9%', icon: 'Activity' },
        { label: 'Deployment Speed', value: '10x faster', icon: 'Zap' },
        { label: 'Incident Resolution', value: '60% faster', icon: 'CheckCircle' },
      ],
      testimonial: {
        quote: 'The migration exceeded our expectations. The platform is more reliable, faster, and costs significantly less to operate.',
        author: 'John Smith',
        position: 'CTO, Enterprise Corp',
      },
    },
    features: [
      'Automated application discovery and dependency mapping',
      'Cost analysis and optimization recommendations',
      'Containerization and orchestration',
      'CI/CD pipeline integration',
      'Comprehensive monitoring and logging',
      'Disaster recovery and backup automation',
    ],
    learnings: [
      'Always start with a thorough assessment phase',
      'Invest in automation early to reduce manual errors',
      'Build monitoring and observability from day one',
      'Regular communication with stakeholders is critical',
    ],
    githubUrl: 'https://github.com/yourusername/cloud-migration-platform',
    liveUrl: 'https://demo.cloudmigration.com',
    status: 'completed',
  },
  {
    id: 'real-time-analytics-dashboard',
    title: 'Real-Time Analytics Dashboard',
    tagline: 'Processing millions of events per second with sub-second latency',
    description: 'Built a real-time analytics platform that processes streaming data from IoT devices, providing instant insights and predictive analytics for manufacturing operations.',
    coverImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=600&fit=crop',
    category: 'Data Engineering',
    tags: ['React', 'Azure', 'Real-time', 'Analytics', 'IoT'],
    timeline: {
      start: '2023-06',
      end: '2024-01',
      duration: '8 months',
    },
    team: {
      size: 5,
      role: 'Full Stack Lead',
    },
    technologies: {
      frontend: ['React', 'Next.js', 'TypeScript', 'Recharts', 'TailwindCSS'],
      backend: ['Node.js', 'Azure Functions', 'SignalR', 'Event Hubs'],
      database: ['Azure Data Explorer', 'Time Series Insights', 'Redis'],
      infrastructure: ['Azure Stream Analytics', 'Azure IoT Hub', 'CDN'],
    },
    challenge: {
      title: 'Real-Time at Scale',
      description: 'Processing and visualizing millions of IoT sensor readings per second while maintaining sub-second latency for critical alerts.',
      keyPoints: [
        'Handle 5M+ events per second during peak hours',
        'Maintain sub-second latency for critical alerts',
        'Support complex aggregations and custom queries',
        'Ensure data accuracy and consistency',
        'Scale horizontally based on demand',
      ],
    },
    solution: {
      title: 'Event-Driven Architecture',
      description: 'Designed a scalable event-driven system with stream processing, caching layers, and optimized data structures.',
      keyPoints: [
        'Implemented Azure Event Hubs for ingestion',
        'Used Stream Analytics for real-time processing',
        'Built multi-layer caching strategy with Redis',
        'Created WebSocket connections for live updates',
        'Optimized queries with Azure Data Explorer',
        'Implemented data sampling for historical analysis',
      ],
    },
    outcomes: {
      title: 'Performance Achievements',
      metrics: [
        { label: 'Events/Second', value: '5M+', icon: 'Activity' },
        { label: 'Alert Latency', value: '<500ms', icon: 'Zap' },
        { label: 'Data Accuracy', value: '99.99%', icon: 'Target' },
        { label: 'Cost Savings', value: '35%', icon: 'TrendingDown' },
      ],
    },
    features: [
      'Real-time data visualization',
      'Custom alert rules and notifications',
      'Historical data analysis',
      'Predictive maintenance insights',
      'Multi-tenant support',
      'Mobile-responsive dashboard',
    ],
    githubUrl: 'https://github.com/yourusername/analytics-dashboard',
    status: 'completed',
  },
  {
    id: 'microservices-ecommerce',
    title: 'Scalable E-Commerce Platform',
    tagline: 'Modern microservices architecture handling 100K+ daily transactions',
    description: 'Architected and developed a cloud-native e-commerce platform using microservices, supporting multiple tenants and processing thousands of orders per hour.',
    coverImage: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&h=600&fit=crop',
    category: 'E-Commerce',
    tags: ['Microservices', '.NET', 'React', 'Azure', 'E-Commerce'],
    timeline: {
      start: '2022-09',
      end: '2023-08',
      duration: '12 months',
    },
    team: {
      size: 12,
      role: 'Solutions Architect',
    },
    technologies: {
      frontend: ['React', 'Next.js', 'Redux', 'Material-UI'],
      backend: ['C#', '.NET 8', 'Azure Service Fabric', 'RabbitMQ'],
      database: ['SQL Server', 'MongoDB', 'Elasticsearch'],
      infrastructure: ['Azure', 'Docker', 'Kubernetes', 'API Management'],
      tools: ['Azure DevOps', 'SonarQube', 'Application Insights'],
    },
    challenge: {
      title: 'Legacy System Modernization',
      description: 'Replace a monolithic e-commerce system with a modern, scalable microservices architecture while maintaining business continuity.',
      keyPoints: [
        'Migrate from monolith without downtime',
        'Handle peak traffic of 100K+ concurrent users',
        'Ensure PCI-DSS compliance',
        'Support multi-currency and multi-language',
        'Integrate with 15+ third-party services',
      ],
    },
    solution: {
      title: 'Strangler Fig Pattern',
      description: 'Gradually replaced the monolith with microservices using the strangler fig pattern, ensuring zero downtime.',
      keyPoints: [
        'Implemented API Gateway for routing',
        'Created 12 domain-driven microservices',
        'Built event-driven communication with RabbitMQ',
        'Implemented CQRS for order processing',
        'Added distributed tracing and logging',
        'Automated deployment with CI/CD pipelines',
      ],
    },
    outcomes: {
      title: 'Business Impact',
      metrics: [
        { label: 'Page Load Time', value: '60% faster', icon: 'Zap' },
        { label: 'System Uptime', value: '99.95%', icon: 'Activity' },
        { label: 'Development Velocity', value: '3x faster', icon: 'TrendingUp' },
        { label: 'Customer Satisfaction', value: '+25%', icon: 'Heart' },
      ],
    },
    features: [
      'Product catalog management',
      'Shopping cart and checkout',
      'Payment gateway integration',
      'Inventory management',
      'Order fulfillment',
      'Customer reviews and ratings',
      'Recommendation engine',
      'Admin dashboard',
    ],
    status: 'completed',
  },
];

export function getCaseStudyById(id: string): CaseStudy | undefined {
  return caseStudies.find((study) => study.id === id);
}

export function getAllCaseStudies(): CaseStudy[] {
  return caseStudies;
}

export function getCaseStudiesByCategory(category: string): CaseStudy[] {
  return caseStudies.filter((study) => study.category === category);
}

export function getFeaturedCaseStudies(limit: number = 3): CaseStudy[] {
  return caseStudies.slice(0, limit);
}
