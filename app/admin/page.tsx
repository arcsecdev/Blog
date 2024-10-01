import Footer from '../components/footer';
import { BlogPosts } from '../components/posts';
import Link from 'next/link';

export const metadata = {
  title: 'Admin',
  description: 'Manage your blog posts',
};

export default function AdminPage() {
  return (
    <section>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-semibold tracking-tighter">
          Admin Dashboard
        </h1>
        <Link href="/admin/new" className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
          New Post
        </Link>
      </div>
      <p className="mb-4">
        {`I'm a Vim enthusiast and tab advocate, finding unmatched efficiency in
        Vim's keystroke commands and tabs' flexibility for personal viewing
        preferences. This extends to my support for static typing, where its
        early error detection ensures cleaner code, and my preference for dark
        mode, which eases long coding sessions by reducing eye strain.`}
      </p>
      <div className="my-8">
        <BlogPosts />
      </div>
    </section>
  );
}