import React, { useState } from "react";
import Navbar from "../Components/Layout/NavBar";
// import { button } from "@/components/ui/button";
import { ArrowUp } from "lucide-react";
import { content } from "./landingContent";
import clientImg1 from "../assets/images/cashfluence_img.jpg";
import socialIcons from "../assets/images/socialicons.png";
import TeamLoan from "../assets/images/term-loan.png";
import TeamWork from "../assets/images/team-work.png";
import RepaymentLogo from "../assets/images/repayment.png";
import InterestRate from "../assets/images/interest-rate-1.png";
import loan from "../assets/images/loan-1.png";
import AboutUs from "../assets/images/about.jpg";
import Secure from "../assets/images/secure-shield.png";
import Background from "../assets/images/background3.png";
import Feature1 from "../assets/images/feature.jpg";
import Feature2 from "../assets/images/feature1.jpg";
import Feature3 from "../assets/images/feature.2.jpg";
import testimonialImg from "../assets/images/testimonialImg.jpg";
import blog1 from "../assets/images/blog-1.jpg";
import blog2 from "../assets/images/blog-2.jpg";
import blog3 from "../assets/images/blog-3.jpg";
const client = [clientImg1, clientImg1, clientImg1, clientImg1];
const LandingPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    message: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    phone: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name) {
      newErrors.name = "Name is required";
    }
    if (!formData.phone) {
      newErrors.phone = "Phone number is required";
    }
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email address is invalid";
    }
    if (!formData.message) {
      newErrors.message = "Message is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      console.log("Form submitted:", formData);
      // Handle form submission (e.g., send data to API)
    }
  };
  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Gradient background */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center"
        style={{
          backgroundImage: `linear-gradient(to bottom right, #ec4899, #8b5cf6, #fb923c), url(${Background})`,
          backgroundBlendMode: "overlay",
        }}
      ></div>
      {/* Social media icons watermark (faded in background) */}

      {/* Main content */}
      <div className="relative z-10 flex-1 flex flex-col">
        {/* Navigation */}
        <Navbar />

        {/* Hero Section */}
        <div className="flex-1 flex flex-col items-center justify-center px-4 md:px-10 lg:px-20 py-10 text-center">
          <p className="text-white tracking-[0.2em] uppercase mb-8">
            Welcome to Cash Fluence
          </p>

          <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold text-white mb-6 leading-tight">
            Empowering Influencers with
            <br />
            Instant Emergency Loans
          </h1>

          <p className="text-white text-lg md:text-xl max-w-3xl mb-10">
            At Cash Fluence, we provide fast, flexible loans to influencers with
            ongoing projects, ensuring you never miss a beat. Get the funds you
            need now, and repay once your payments clear. Keep creating,
            stress-free!
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-black hover:bg-gray-900 text-white px-8 py-6 rounded-full text-lg">
              Contact Us
            </button>
            <button
              variant="outline"
              className="border-2 border-white bg-transparent hover:bg-white/10 text-white px-8 py-6 rounded-full text-lg"
            >
              About Us
            </button>
          </div>

          {/* Client display */}
          <div className="mt-16">
            <div className="flex items-center justify-center">
              <div className="flex -space-x-4">
                {client?.map((i, index) => (
                  <div
                    key={index}
                    className="w-12 h-12 rounded-full border-2 border-white overflow-hidden"
                  >
                    <img
                      src={i}
                      alt="clientImages"
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>

              <div className="ml-4 text-left">
                <h3 className="text-white text-2xl font-bold">1,000 +</h3>
                <p className="text-white">Satisfied Clients</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section with Image */}
      <div className="relative z-10 w-full mt-16 mb-10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="bg-white rounded-3xl overflow-hidden shadow-xl">
            <img
              src={clientImg1}
              alt="Influencer creating content"
              className="w-full h-84 object-cover"
            />
          </div>
        </div>
      </div>

      {/* About Us Section */}
      <div className="relative z-10 bg-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center">
            <div className="relative md:w-1/2 mb-8 md:mb-0">
              <img
                src={AboutUs}
                alt="Influencer with product"
                className="rounded-lg shadow-lg w-full"
              />
              <img
                src={socialIcons}
                alt="Overlay"
                className="absolute bottom-4 left-4 w-16 h-16 rounded-full shadow-md"
              />
            </div>

            <div className="md:w-1/2 md:pl-12">
              <p className="uppercase text-gray-600 tracking-wider mb-2">
                ABOUT US
              </p>
              <h2 className="text-3xl md:text-5xl font-bold mb-6">
                Your Trusted Partner in Financial Flexibility
              </h2>
              <p className="text-gray-700 leading-relaxed mb-8">
                Cash Fluence was founded with a simple mission: to support
                influencers in navigating the financial challenges of their
                fast-paced industry. We specialize in providing quick and
                reliable emergency loans for influencers who need immediate
                funding to keep their projects on track. With our hassle-free
                application process, flexible repayment options, and commitment
                to transparency, Cash Fluence is more than just a lender—we're a
                partner in your creative journey, ensuring you can focus on what
                you do best while we take care of the rest.
              </p>

              <div className="grid grid-cols-2 gap-8 mb-8">
                <div>
                  <p className="text-3xl font-bold">24 /hr</p>
                  <p className="text-gray-500">Loans Approval</p>
                </div>
                <div>
                  <p className="text-3xl font-bold">98 %</p>
                  <p className="text-gray-500">Satisfaction Rate</p>
                </div>
                <div>
                  <p className="text-3xl font-bold">85 %</p>
                  <p className="text-gray-500">Repeat Clients</p>
                </div>
                <div>
                  <p className="text-3xl font-bold">77 %</p>
                  <p className="text-gray-500">Faster Growth</p>
                </div>
              </div>

              <button className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-8 rounded-full">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="relative py-20 overflow-hidden">
        {/* Gradient background for features section */}
        <div className="absolute inset-0 bg-gradient-to-r from-pink-500 via-purple-500 to-green-500 z-0"></div>

        <div className="relative z-10 max-w-7xl mx-auto px-4">
          {/* Section Header */}
          <div className="text-center mb-16">
            <p className="text-white uppercase tracking-widest mb-2">
              OUR FEATURES
            </p>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">
              The Best Financial Partner for
              <br />
              Influencers
            </h2>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white rounded-xl shadow-lg p-8 text-center">
              <div className="w-20 h-20 mx-auto mb-6 flex items-center justify-center bg-orange-500 rounded-full">
                <img src={loan} alt="loan" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Instant Loan Approval</h3>
              <p className="text-gray-600">
                Get approved within hours, ensuring you have the funds you need
                to keep your projects moving without delay.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white rounded-xl shadow-lg p-8 text-center">
              <div className="w-20 h-20 mx-auto mb-6 flex items-center justify-center bg-orange-500 rounded-full">
                <img src={TeamLoan} alt="TeamLoan" />
              </div>
              <h3 className="text-2xl font-bold mb-4">
                Flexible Repayment Plans
              </h3>
              <p className="text-gray-600">
                Repay your loan when your project payments come through,
                allowing you to manage your cash flow with ease.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white rounded-xl shadow-lg p-8 text-center">
              <div className="w-20 h-20 mx-auto mb-6 flex items-center justify-center bg-orange-500 rounded-full">
                <img src={RepaymentLogo} alt="RepaymentLogo" />
              </div>
              <h3 className="text-2xl font-bold mb-4">No Credit Check</h3>
              <p className="text-gray-600">
                Our loans are based on your current projects and potential
                earnings, not your past credit history.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-white rounded-xl shadow-lg p-8 text-center">
              <div className="w-20 h-20 mx-auto mb-6 flex items-center justify-center bg-orange-500 rounded-full">
                <img src={InterestRate} alt="InterestRate" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Competitive Interest</h3>
              <p className="text-gray-600">
                Enjoy fair and transparent rates that make borrowing affordable
                and keep your repayment costs low.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-white rounded-xl shadow-lg p-8 text-center">
              <div className="w-20 h-20 mx-auto mb-6 flex items-center justify-center bg-orange-500 rounded-full">
                <img src={TeamWork} alt="TeamWork" />
              </div>
              <h3 className="text-2xl font-bold mb-4">
                Dedicated Support Team
              </h3>
              <p className="text-gray-600">
                Our friendly team is here to guide you through every step,
                providing personalized assistance whenever you need it.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-white rounded-xl shadow-lg p-8 text-center">
              <div className="w-20 h-20 mx-auto mb-6 flex items-center justify-center bg-orange-500 rounded-full">
                <img src={Secure} alt="Secure" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Secure & Confidential</h3>
              <p className="text-gray-600">
                We use top-notch security measures to protect your personal and
                financial information, ensuring your privacy.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Discover How We Help Influencers Section */}
      <div className="relative z-10 bg-black py-20">
        <div className="max-w-7xl mx-auto px-4">
          <p className="text-green-500 uppercase font-medium tracking-widest mb-2 text-center">
            DISCOVER HOW WE HELP INFLUENCERS
          </p>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-12 text-center">
            Empowering Influencers with
            <br />
            Financial Solutions
          </h2>

          <div className="bg-white rounded-2xl overflow-hidden shadow-2xl">
            <div className="flex flex-col md:flex-row">
              <div className="md:w-1/2 p-8 md:p-12">
                <p className="uppercase text-gray-600 tracking-widest font-medium mb-3">
                  OUR MISSION
                </p>

                <h3 className="text-3xl md:text-4xl font-bold mb-6">
                  Fueling Creativity, One Loan at a Time
                </h3>

                <p className="text-gray-700 leading-relaxed mb-8">
                  At Cash Fluence, our mission is to be the financial partner
                  that fuels your creative ambitions. We are dedicated to
                  providing influencers with swift, flexible emergency loans
                  that ensure uninterrupted progress on your projects. By
                  focusing on your current needs and future potential, we
                  eliminate financial barriers and empower you to continue
                  making an impact. Your creativity drives us, and we're here to
                  support your journey every step of the way.
                </p>

                <button className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-8 rounded-full">
                  Learn More
                </button>
              </div>
              <div className="md:w-1/2">
                <img
                  src={Feature1}
                  alt="Influencer creating content"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          <div className="mt-16">
            <div className="bg-white rounded-2xl overflow-hidden shadow-2xl">
              <div className="flex flex-col md:flex-row">
                <div className="md:w-1/2 order-2 md:order-1">
                  <img
                    src={Feature2}
                    alt="Male influencer with product"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="md:w-1/2 p-8 md:p-12 order-1 md:order-2">
                  <p className="uppercase text-gray-600 tracking-widest font-medium mb-3">
                    OUR VISION
                  </p>

                  <h3 className="text-3xl md:text-4xl font-bold mb-6">
                    Redefining Financial Support for the Modern Creator
                  </h3>

                  <p className="text-gray-700 leading-relaxed mb-8">
                    At Cash Fluence, we envision a world where financial hurdles
                    are no longer a barrier to creativity and success. Our goal
                    is to revolutionize the way influencers access financial
                    support by providing fast, flexible, and seamless loan
                    solutions tailored to their unique needs. We aim to be the
                    go-to financial ally for creators worldwide, helping them
                    turn their visions into reality without the constraints of
                    financial uncertainty.
                  </p>

                  <button className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-8 rounded-full">
                    Learn More
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-16">
            <div className="bg-white rounded-2xl overflow-hidden shadow-2xl">
              <div className="flex flex-col md:flex-row">
                <div className="md:w-1/2 p-8 md:p-12">
                  <p className="uppercase text-gray-600 tracking-widest font-medium mb-3">
                    OUR COMMITMENT
                  </p>

                  <h3 className="text-3xl md:text-4xl font-bold mb-6">
                    Core Values That Drive Us Forward
                  </h3>

                  <p className="text-gray-700 leading-relaxed mb-8">
                    At Cash Fluence, our values are the heartbeat of everything
                    we do. We believe in integrity—honoring transparency and
                    fairness in all our interactions. Support is at our core,
                    with a dedicated team ready to assist you every step of the
                    way. Our commitment to Empowerment drives us to provide
                    flexible financial solutions that help you thrive. These
                    guiding principles ensure that we remain a reliable partner,
                    dedicated to fueling your creativity and supporting your
                    journey towards success.
                  </p>

                  <button className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-8 rounded-full">
                    Learn More
                  </button>
                </div>
                <div className="md:w-1/2">
                  <img
                    src={Feature3}
                    alt="Female influencer with shopping bags"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonial Section */}
      <div className="relative z-10 bg-white py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-8 md:mb-0">
              <div className="relative">
                <img
                  src={testimonialImg}
                  alt="Happy Customer"
                  className="rounded-2xl shadow-lg"
                />
                <div className="absolute bottom-8 left-8 right-8 bg-white p-8 rounded-xl shadow-lg">
                  <p className="italic text-gray-700 mb-6">
                    "Cash Fluence came through for me when I needed it the most.
                    Their fast approval process meant I had the funds I needed
                    in no time, and the flexible repayment terms made managing
                    my budget so much easier. The team was incredibly supportive
                    and made the whole experience stress-free. I couldn't have
                    asked for a better financial partner!"
                  </p>
                  <div className="flex items-center">
                    <div className="mr-4">
                      <p className="font-bold">Emily B.</p>
                      <p className="text-sm text-gray-500">Client</p>
                    </div>
                    <div className="ml-auto text-4xl text-gray-200 font-serif">
                      "
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="md:w-1/2 md:pl-12">
              <p className="uppercase text-gray-600 tracking-widest mb-3">
                TESTIMONIAL
              </p>

              <h3 className="text-3xl md:text-5xl font-bold mb-6">
                What Our Amazing Customers Say
              </h3>

              <p className="text-gray-700 leading-relaxed mb-8">
                Curious about how Cash Fluence has made a difference for
                influencers like you? Check out our testimonials to hear
                firsthand accounts from our satisfied clients. Discover how our
                quick approval process, flexible loans, and dedicated support
                have helped them overcome financial challenges and keep their
                projects thriving. Your success story could be next!
              </p>

              <button className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-8 rounded-full">
                Read More Stories
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Get Started Section */}
      <div className="relative py-20 overflow-hidden">
        {/* Gradient background for Get Started section */}
        <div className="absolute inset-0 bg-gradient-to-r from-pink-500 via-purple-500 to-green-500 z-0"></div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 py-16 text-center">
          <p className="text-white uppercase tracking-widest mb-2">
            GET STARTED
          </p>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-8">
            Ready to Keep Your
            <br />
            Projects on Track?
          </h2>

          <p className="text-white text-lg md:text-xl max-w-3xl mx-auto mb-10">
            Don't let financial hurdles slow you down. Apply for a Cash Fluence
            emergency loan today and get the funds you need to keep your
            creative projects moving forward.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-black hover:bg-gray-900 text-white px-8 py-6 rounded-full text-lg">
              Contact Us
            </button>
            <button
              variant="outline"
              className="border-2 border-white bg-transparent hover:bg-white/10 text-white px-8 py-6 rounded-full text-lg"
            >
              About Us
            </button>
          </div>
        </div>
      </div>

      {/* Our Process Section */}
      <div className="relative z-10 bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="uppercase text-gray-600 tracking-widest mb-2">
            OUR PROCESS
          </p>

          <h2 className="text-4xl md:text-5xl font-bold mb-16">
            Simple Steps to Get Your Loan
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="bg-gray-900 rounded-lg p-8 text-left">
              <h3 className="text-4xl font-bold text-green-500 mb-4">01.</h3>
              <h4 className="text-2xl font-bold text-white mb-4">
                Apply Online
              </h4>
              <p className="text-gray-300">
                Fill out our quick and easy online application form to get
                started. Provide details about your current project and
                financial needs.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-gray-900 rounded-lg p-8 text-left">
              <h3 className="text-4xl font-bold text-green-500 mb-4">02.</h3>
              <h4 className="text-2xl font-bold text-white mb-4">
                Get Approved Fast
              </h4>
              <p className="text-gray-300">
                Our team reviews your application and provides loan approval
                within hours. We'll get in touch to confirm the details and
                finalize the loan.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-gray-900 rounded-lg p-8 text-left">
              <h3 className="text-4xl font-bold text-green-500 mb-4">03.</h3>
              <h4 className="text-2xl font-bold text-white mb-4">
                Receive & Repay
              </h4>
              <p className="text-gray-300">
                Access your funds swiftly and use them to support your project.
                Once your project payments come through, repay the loan easily
                according to the agreed terms.
              </p>
            </div>
          </div>
        </div>
        <div className="container mx-auto py-16 px-4">
          <h2 className="text-3xl font-semibold text-center mb-12">
            Insights, Tips, and Trends for Influencers
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            <div className="bg-white shadow-lg rounded-lg overflow-hidden">
              <img
                className="w-full h-48 object-cover"
                src={blog1}
                alt="Blog 1"
              />
              <div className="p-6">
                <p className="text-sm text-gray-500">
                  cashfluence • August 28, 2024
                </p>
                <h3 className="text-xl font-semibold my-2">
                  The Benefits of Quick Loans for Creators
                </h3>
                <p className="text-gray-700 text-base">
                  In the fast-paced world of content creation, financial
                  flexibility can...
                </p>
              </div>
            </div>

            <div className="bg-white shadow-lg rounded-lg overflow-hidden">
              <img
                className="w-full h-48 object-cover"
                src={blog2}
                alt="Blog 2"
              />
              <div className="p-6">
                <p className="text-sm text-gray-500">
                  cashfluence • August 28, 2024
                </p>
                <h3 className="text-xl font-semibold my-2">
                  How to Manage Cash Flow as an Influencer
                </h3>
                <p className="text-gray-700 text-base">
                  Managing cash flow is crucial for influencers who often
                  experience...
                </p>
              </div>
            </div>

            <div className="bg-white shadow-lg rounded-lg overflow-hidden">
              <img
                className="w-full h-48 object-cover"
                src={blog3}
                alt="Blog 3"
              />
              <div className="p-6">
                <p className="text-sm text-gray-500">
                  cashfluence • August 28, 2024
                </p>
                <h3 className="text-xl font-semibold my-2">
                  Top 5 Financial Tips for Influencers
                </h3>
                <p className="text-gray-700 text-base">
                  In the fast-paced world of influencing, managing finances
                  effectively can...
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="min-h-screen w-full bg-gradient-to-r from-[#ff3366] via-[#9b30ff] to-[#99cc33] flex items-center p-4 md:p-8">
          <div className="container mx-auto flex flex-col md:flex-row items-center justify-between">
            {/* Left Section - Text Content */}
            <div className="w-full md:w-1/2 text-white mb-10 md:mb-0">
              <p className="text-white uppercase tracking-wider mb-2">
                APPLY NOW
              </p>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Get the Support You Need Today
              </h1>
              <p className="mb-8 max-w-lg">
                Ready to take the next step? Apply for a Cash Fluence emergency
                loan and get the financial support you need to keep your
                projects on track. Our simple application process ensures you
                receive quick approval and funds, so you can focus on creating
                and growing your influence. Don't wait—start your application
                now and experience the ease of working with a dedicated
                financial partner.
              </p>

              {/* Contact Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10">
                <div className="flex items-center">
                  <div className="bg-white rounded-full p-3 mr-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-[#9b30ff]"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium">Our Phone</p>
                    <p>+1 (234) 567 890 00</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <div className="bg-white rounded-full p-3 mr-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-[#9b30ff]"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium">Our Email</p>
                    <p>info@mail.com</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Section - Contact Form */}
            <div className="w-full md:w-5/12">
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-8 shadow-lg">
                <form className="space-y-5">
                  <div>
                    <label htmlFor="name" className="block text-white mb-1">
                      Your Name <span className="text-red-300">*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      placeholder="Jhon Doe"
                      className="w-full px-4 py-3 rounded-lg bg-white border-0 focus:ring-2 focus:ring-[#ff3366]"
                      required
                    />
                  </div>

                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="w-full md:w-1/2">
                      <label htmlFor="phone" className="block text-white mb-1">
                        Phone <span className="text-red-300">*</span>
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        placeholder="+1 (234) 567 890"
                        className="w-full px-4 py-3 rounded-lg bg-white border-0 focus:ring-2 focus:ring-[#ff3366]"
                        required
                      />
                    </div>
                    <div className="w-full md:w-1/2">
                      <label htmlFor="email" className="block text-white mb-1">
                        Email <span className="text-red-300">*</span>
                      </label>
                      <input
                        type="email"
                        id="email"
                        placeholder="example@mail.com"
                        className="w-full px-4 py-3 rounded-lg bg-white border-0 focus:ring-2 focus:ring-[#ff3366]"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-white mb-1">
                      Message
                    </label>
                    <textarea
                      id="message"
                      rows={5}
                      placeholder="Hello there!"
                      className="w-full px-4 py-3 rounded-lg bg-white border-0 focus:ring-2 focus:ring-[#ff3366]"
                    ></textarea>
                  </div>

                  <div className="text-center">
                    <button
                      type="submit"
                      className="bg-[#4CAF50] hover:bg-[#45a049] text-white font-medium py-3 px-8 rounded-full transition duration-300"
                    >
                      Submit Form
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
        <footer className="bg-[#0d1211] text-white py-16">
          <div className="container mx-auto px-4">
            {/* Top section with logo and contact info */}
            <div className="flex flex-col md:flex-row justify-between items-start mb-12">
              {/* Logo and social media */}
              <div className="mb-8 md:mb-0">
                <img
                  src="/lovable-uploads/f6cd8a26-c219-4167-87e9-e3f39bfa354d.png"
                  alt="CashFluence Logo"
                  className="h-12 mb-6"
                />
                <div className="flex gap-3">
                  <a
                    href="#"
                    className="bg-[#222222] hover:bg-gray-700 rounded-full p-2 transition-colors"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                    </svg>
                  </a>
                  <a
                    href="#"
                    className="bg-[#222222] hover:bg-gray-700 rounded-full p-2 transition-colors"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
                    </svg>
                  </a>
                  <a
                    href="#"
                    className="bg-[#222222] hover:bg-gray-700 rounded-full p-2 transition-colors"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path>
                      <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon>
                    </svg>
                  </a>
                  <a
                    href="#"
                    className="bg-[#222222] hover:bg-gray-700 rounded-full p-2 transition-colors"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                      <rect x="2" y="9" width="4" height="12"></rect>
                      <circle cx="4" cy="4" r="2"></circle>
                    </svg>
                  </a>
                </div>
              </div>

              {/* Contact cards */}
              <div className="flex flex-col md:flex-row gap-4">
                <div className="bg-white text-black rounded-lg p-4 flex items-center w-full md:w-64">
                  <div className="bg-black rounded-full p-2 mr-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold">Our Phone</h4>
                    <p className="text-gray-600 text-sm">
                      +1 (234) 567 890 001
                    </p>
                  </div>
                </div>

                <div className="bg-[#66BB6A] text-white rounded-lg p-4 flex items-center w-full md:w-64">
                  <div className="bg-black rounded-full p-2 mr-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold">Our Email</h4>
                    <p className="text-sm">influce.info@mail.com</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Divider */}
            <hr className="border-gray-800 my-8" />

            {/* Middle section with address, explore, and newsletter */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Address */}
              <div>
                <h3 className="text-xl font-bold mb-4">Address</h3>
                <p className="text-gray-400 mb-1">
                  024 Erling Knolls, Lake Kenny
                </p>
                <p className="text-gray-400 mb-6">North Dakota 8902</p>

                <h3 className="text-xl font-bold mb-4">Contact</h3>
                <p className="text-gray-400 mb-1">+1 (234) 567 890</p>
                <p className="text-gray-400">info@mail.com</p>
              </div>

              {/* Explore */}
              <div>
                <h3 className="text-xl font-bold mb-4">Explore</h3>
                <ul className="space-y-3">
                  <li>
                    <a href="#" className="text-gray-400 hover:text-white">
                      Home
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-400 hover:text-white">
                      About
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-400 hover:text-white">
                      Faqs
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-400 hover:text-white">
                      Blogs
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-400 hover:text-white">
                      Contact
                    </a>
                  </li>
                </ul>
              </div>

              {/* Newsletter */}
              <div className="bg-[#66BB6A] rounded-lg p-6">
                <h3 className="text-xl font-bold mb-4">
                  Subscribe Our Newsletter
                </h3>
                <div className="mt-4">
                  <input
                    type="email"
                    placeholder="example@mail.com"
                    className="w-full px-4 py-3 rounded-lg mb-3 text-black"
                  />
                  <button className="bg-black hover:bg-gray-800 text-white rounded-full px-6 py-2 font-medium">
                    Subscribe
                  </button>
                </div>
              </div>
            </div>

            {/* Divider */}
            <hr className="border-gray-800 my-8" />

            {/* Bottom section with copyright and policy links */}
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-400 mb-4 md:mb-0">
                Copyright © 2024 Cash Fluence
              </p>
              <div className="flex gap-6">
                <a href="#" className="text-gray-400 hover:text-white">
                  Privacy Policy
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  Terms & Services
                </a>
              </div>
            </div>
          </div>

          {/* Back to top button */}
          <div className="fixed bottom-6 right-6">
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="bg-green-600 hover:bg-green-700 text-white rounded-full p-3 shadow-lg"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 15l7-7 7 7"
                />
              </svg>
            </button>
          </div>
        </footer>
      </div>

      {/* Back to top button */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="fixed bottom-6 right-6 bg-green-500 hover:bg-green-600 text-white p-3 rounded-full shadow-lg z-50"
      >
        <ArrowUp size={24} />
      </button>
    </div>
  );
};

export default LandingPage;
