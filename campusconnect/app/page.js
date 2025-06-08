import Image from "next/image";
import Link from "next/link";
import mainImage from "@/public/landingPage/mainimage.png"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <main className="max-w-6xl mx-auto">
        {/* Hero Section */}
        <section className="flex flex-col md:flex-row items-center justify-between gap-12 py-16">
          <div className="md:w-1/2 space-y-6">
            <h1 className="text-5xl font-bold text-gray-900 leading-tight">
              <span className="bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
                Campus Connect
              </span>{" "}
              - Your Ultimate Student Hub
            </h1>
            <p className="text-xl text-gray-600">
              Discover events, connect with peers, and make your campus life unforgettable. All in one place.
            </p>
            <div className="flex gap-4">
              <Link 
                href="/login" 
                className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-all shadow-lg hover:shadow-xl"
              >
                Get Started
              </Link>
              <Link 
                href="/events" 
                className="px-6 py-3 border-2 border-indigo-600 text-indigo-600 rounded-lg font-medium hover:bg-indigo-50 transition-all"
              >
                Explore Events
              </Link>
            </div>
          </div>
          <div className="md:w-1/2">
            <Image
              src={mainImage} // Replace with your actual image path
              alt="Students enjoying campus life"
              width={600}
              height={400}
              className="rounded-xl shadow-2xl h-[400px] w-[400px]"
              priority
            />
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
            Why Students Love Us
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: "🎉",
                title: "Events Made Easy",
                description: "Find all campus events in one place - no more FOMO!"
              },
              {
                icon: "👥",
                title: "Connect Easily",
                description: "Meet students who share your interests and passions"
              },
              {
                icon: "📱",
                title: "Always Accessible",
                description: "Mobile-friendly platform that works anywhere, anytime"
              }
            ].map((feature, index) => (
              <div key={index} className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-2 text-gray-800">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Testimonial */}
        <section className="py-16 bg-white rounded-xl shadow-inner">
          <div className="max-w-3xl mx-auto text-center">
            <blockquote className="text-2xl italic text-gray-700 mb-6">
              "Campus Connect completely transformed my university experience. I've made friends and attended events I never would have known about otherwise!"
            </blockquote>
            <div className="flex items-center justify-center gap-4">
              <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                <span className="text-indigo-600 font-bold">JD</span>
              </div>
              <div className="text-left">
                <p className="font-medium">Rajneesh Kumar</p>
                <p className="text-gray-500 text-sm">Senior, Computer Science</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="mt-16 py-8 border-t border-gray-200 text-center text-gray-600">
        <p>Made with ❤️ for students everywhere</p>
        <p className="mt-2 text-sm">© {new Date().getFullYear()} Campus Connect. All rights reserved.</p>
      </footer>
    </div>
  );
}