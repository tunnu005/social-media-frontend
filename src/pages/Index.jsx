import React from 'react';
import { ArrowRight, Users, Smile, Globe } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function Index() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white ">
      <div className="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <header className="text-center mb-16">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 ">
            Welcome to Buzzzy-Media
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-600 ">
            Where connections come alive, one post at a time.
          </p>
        </header>

        <main className="space-y-16">
          <section className="grid gap-8 md:grid-cols-3">
            {[
              {
                title: 'Stay Connected',
                description: 'Easily keep up with friends and loved ones.',
                icon: Globe,
              },
              {
                title: 'Real-Time Conversations',
                description: 'Chat and share updates as they happen.',
                icon: Users,
              },
              {
                title: 'Share the Fun',
                description: 'Post, react, and enjoy memorable moments together.',
                icon: Smile,
              },
            ]
              .map((feature, index) => (
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
            <h2 className="text-3xl font-bold tracking-tight text-gray-900  sm:text-4xl mb-6">
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
            <h2 className="text-2xl font-bold tracking-tight text-gray-900 ">
              About Buzzzy-Media
            </h2>
            <p className="text-gray-600 ">
            Discover a community-driven social platform where you can connect, share, and engage in real time. Build meaningful connections with like-minded users, share your moments instantly, and enjoy a space that prioritizes dynamic, engaging interactions. Join us and stay connected, one memorable post at a time.
            </p>
          </section>
        </main>

        <footer className="mt-16 text-center text-sm text-gray-500 ">
          <p>developed by <a href="https://www.instagram.com/taral_001/">Taral Patel</a></p>
          <p>&copy; {new Date().getFullYear()} Buzzzy. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
}
