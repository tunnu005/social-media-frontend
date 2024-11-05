import React from 'react';
import { ArrowRight, Users, Zap, Globe } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function Index() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <header className="text-center mb-16">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-6xl">
            Welcome to SocialConnect
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
            Connect, share, and discover with the world's most engaging social platform.
          </p>
        </header>

        <main className="space-y-16">
          <section className="grid gap-8 md:grid-cols-3">
            {[
              {
                title: 'Global Community',
                description: 'Join millions of users from around the world.',
                icon: Globe,
              },
              {
                title: 'Real-time Interactions',
                description: 'Engage with friends and followers instantly.',
                icon: Zap,
              },
              {
                title: 'Diverse Networks',
                description: 'Build connections across various interests and fields.',
                icon: Users,
              },
            ].map((feature, index) => (
              <Card key={index}>
                <CardHeader>
                  <feature.icon className="h-8 w-8 mb-2 text-blue-500" />
                  <CardTitle>{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </section>

          <section className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl mb-6">
              Ready to get started?
            </h2>
            <div className="flex justify-center gap-4">
              <a href="/auth">
                <Button size="lg">
                  Login <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </a>
             
            </div>
          </section>

          <section className="border-t border-gray-200 dark:border-gray-700 pt-8">
            <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white mb-4">
              About SocialConnect
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              SocialConnect is more than just a social media platform. It's a vibrant ecosystem where ideas flourish, 
              connections deepen, and communities thrive. Whether you're here to share your passions, learn from others, 
              or simply stay connected with friends and family, SocialConnect provides the tools and space for meaningful interactions. 
              With our commitment to user privacy, innovative features, and a user-friendly interface, we're redefining 
              what it means to be social online.
            </p>
          </section>
        </main>

        <footer className="mt-16 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>&copy; {new Date().getFullYear()} SocialConnect. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
}
