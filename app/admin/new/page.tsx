import Footer from '../../components/footer';

export const metadata = {
  title: 'New Post',
  description: 'Create a new blog post',
};

export default function NewPostPage() {
  return (
    <section>
      <h1 className="mb-8 text-2xl font-semibold tracking-tighter">
        New Post
      </h1>
      <p className="mb-4">
        {`This page will contain a form for adding new posts in the future.`}
      </p>
    </section>
  );
}