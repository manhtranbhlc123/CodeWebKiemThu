'use client';

import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Link from 'next/link';
import Image from 'next/image';
import { Calendar, Tag, Facebook, Twitter, Linkedin, Sun, Moon } from 'lucide-react';
import { motion } from 'framer-motion';
import { RootState, useAppDispatch } from '@/app/store';
import { fetchArticleBySlug, fetchRelatedArticles, clearArticle } from '@/app/store/slices/newsSlice';
import { useToast } from '@/components/ui/use-toast';
import { useParams } from 'next/navigation';
import { BaseURL } from '@/app/utils/baseUrl';
import { useTheme } from 'next-themes';

export default function NewsDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const dispatch = useAppDispatch();
  const { article, relatedArticles, loading, error } = useSelector((state: RootState) => state.new);
  const { toast } = useToast();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    dispatch(fetchArticleBySlug(slug) as any);
    return () => {
      dispatch(clearArticle());
    };
  }, [dispatch, slug]);

  useEffect(() => {
    if (article?.category) {
      dispatch(fetchRelatedArticles({ category: article.category, limit: 3, slug: slug }) as any);
    }
  }, [dispatch, article?.category, slug]);

  useEffect(() => {
    if (error) {
      toast({
        title: 'Lỗi',
        description: error,
        variant: 'destructive',
      });
    }
  }, [error, toast]);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  if (!mounted) {
    return null;
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 flex justify-center items-center min-h-screen">
        <svg className="animate-spin h-8 w-8 text-green-600 mr-3" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
        </svg>
        <span className="text-gray-600">Đang tải...</span>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <p className="text-red-500 text-lg">Không tìm thấy bài viết</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-16 bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
        {/* Theme Toggle Button */}

        {/* Breadcrumb Navigation */}
        <motion.nav
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center mb-8 text-sm text-gray-600 dark:text-gray-300"
        >
          <Link href="/" className="hover:text-green-600 dark:hover:text-green-400 transition-colors">
            Trang chủ
          </Link>
          <span className="mx-2">/</span>
          <Link href="/news" className="hover:text-green-600 dark:hover:text-green-400 transition-colors">
            Tin tức
          </Link>
          <span className="mx-2">/</span>
          <span className="font-medium text-gray-800 dark:text-gray-100">{article.title}</span>
        </motion.nav>

        {/* Main Article Section */}
        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden mb-12"
        >
          <div className="relative h-96 lg:h-[500px] w-full overflow-hidden">
            <Image
              src={article.image ? `${BaseURL.baseImage}/images/${article.image}` : '/placeholder.svg?height=500&width=1000'}
              alt={article.title}
              fill
              className="object-cover transition-transform duration-1000 hover:scale-105"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            <div className="absolute bottom-6 left-6 right-6">
              <h1 className="text-3xl lg:text-4xl font-bold text-white leading-tight">{article.title}</h1>
            </div>
          </div>
          <div className="p-6 lg:p-8">
            <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-300 mb-6">
              <div className="flex items-center">
                <Calendar size={16} className="mr-2 text-green-600 dark:text-green-400" />
                <span>{new Date(article.date).toLocaleDateString('vi-VN')}</span>
              </div>
              <div className="flex items-center">
                <Tag size={16} className="mr-2 text-green-600 dark:text-green-400" />
                <span>{article.category}</span>
              </div>
            </div>
            <div className="prose prose-lg max-w-none text-gray-800 dark:text-gray-200 leading-relaxed mb-8">
              <div dangerouslySetInnerHTML={{ __html: article.content || '' }} />
            </div>
            <div className="flex items-center justify-between border-t pt-6">
              <div className="flex items-center space-x-3">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Chia sẻ:</span>
                <motion.a
                  href="#"
                  className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Facebook size={18} />
                </motion.a>
                <motion.a
                  href="#"
                  className="w-10 h-10 rounded-full bg-blue-400 flex items-center justify-center text-white"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Twitter size={18} />
                </motion.a>
                <motion.a
                  href="#"
                  className="w-10 h-10 rounded-full bg-blue-700 flex items-center justify-center text-white"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Linkedin size={18} />
                </motion.a>
              </div>
            </div>
          </div>
        </motion.article>

        {/* Related Articles */}
        {relatedArticles.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-12"
          >
            <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6">
              Bài Viết Liên Quan
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedArticles.map((related) => (
                <motion.div
                  key={related.id}
                  whileHover={{ y: -5, transition: { duration: 0.3 } }}
                  className="group bg-white dark:bg-gray-800 rounded-2xl shadow-md overflow-hidden hover:shadow-xl hover:border-2 hover:border-green-200 dark:hover:border-green-600 transition-all duration-300"
                >
                  <Link href={`/news/${related.slug}`}>
                    <div className="relative h-48 w-full overflow-hidden">
                      <Image
                        src={related.image ? `${BaseURL.baseImage}/images/${related.image}` : '/placeholder.svg?height=200&width=400'}
                        alt={related.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105 rounded-t-2xl"
                      />
                    </div>
                    <div className="p-5">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2 line-clamp-2 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
                        {related.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">{related.excerpt}</p>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}

        {/* Sticky Social Share Sidebar */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="fixed right-4 top-1/2 transform -translate-y-1/2 flex flex-col space-y-4 z-40"
        >
          <motion.a
            href="#"
            className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white shadow-md"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Facebook size={20} />
          </motion.a>
          <motion.a
            href="#"
            className="w-12 h-12 rounded-full bg-blue-400 flex items-center justify-center text-white shadow-md"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Twitter size={20} />
          </motion.a>
          <motion.a
            href="#"
            className="w-12 h-12 rounded-full bg-blue-700 flex items-center justify-center text-white shadow-md"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Linkedin size={20} />
          </motion.a>
        </motion.div>
      </div>
    </div>
  );
}