import React from 'react';
import Logo from '../components/common/Logo';
import Button from '../components/common/Button';
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const navigate = useNavigate();

    const services = [
        {
            title: "Mượn Phòng Học",
            description: "Đăng ký mượn phòng học cho các hoạt động học tập",
            icon: (
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M4 19V6a2 2 0 012-2h12a2 2 0 012 2v13a2 2 0 01-2 2H6a2 2 0 01-2-2z" strokeWidth="2" fill="currentColor" fillOpacity="0.1" strokeLinejoin="round" />
                    <path d="M4 19V6a2 2 0 012-2h12a2 2 0 012 2v13" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M12 4v17" strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.3" />
                    <path d="M8 8h8" strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.4" />
                    <path d="M8 11h6" strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.4" />
                    <path d="M8 14h8" strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.4" />
                    <path d="M8 17h5" strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.4" />
                    <path d="M16 4v6l-1.5-1-1.5 1V4" strokeWidth="1.5" fill="currentColor" fillOpacity="0.6" strokeLinejoin="round" />
                </svg>
            ),
            buttonText: "Mượn phòng học",
            variant: 'primary',
            onClick: () => navigate('/login'),
            gradient: 'from-blue-500 to-blue-600',
            bgGradient: 'from-blue-50 to-blue-100'
        },
        {
            title: "Thuê Sân Thể Thao",
            description: "Thuê sân bóng và các cơ sở thể thao khác với giá ưu đãi",
            icon: (
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="9.5" strokeWidth="2.5" fill="white" stroke="currentColor" />
                    <path d="M12 7.5L15.5 9.2L14.3 13L9.7 13L8.5 9.2Z" strokeWidth="2" fill="currentColor" fillOpacity="0.8" stroke="currentColor" strokeLinejoin="round" />
                    <path d="M12 7.5L8.5 9.2L6 6.5L9 4L14 4L15.5 9.2" strokeWidth="1.8" fill="none" strokeLinejoin="round" />
                    <path d="M8.5 9.2L9.7 13L6.5 16L4 13.5L4.5 10L6 6.5" strokeWidth="1.8" fill="none" strokeLinejoin="round" />
                    <path d="M15.5 9.2L18 6.5L19.5 10L20 13.5L17.5 16L14.3 13" strokeWidth="1.8" fill="none" strokeLinejoin="round" />
                    <path d="M9.7 13L6.5 16L9 20L15 20L17.5 16L14.3 13" strokeWidth="1.8" fill="none" strokeLinejoin="round" />
                    <ellipse cx="10" cy="8" rx="2" ry="1.5" fill="white" fillOpacity="0.4" stroke="none" />
                </svg>
            ),
            buttonText: "Đặt sân",
            variant: 'success',
            onClick: () => navigate('/login'),
            gradient: 'from-green-500 to-emerald-600',
            bgGradient: 'from-green-50 to-green-100'
        },
        {
            title: "Mượn Thiết bị",
            description: "Mượn laptop, máy chiếu và các dụng cụ học tập khác",
            icon: (
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
            ),
            buttonText: "Xem thiết bị",
            variant: 'purple',
            onClick: () => navigate('/login'),
            gradient: 'from-purple-500 to-violet-600',
            bgGradient: 'from-purple-50 to-purple-100'
        }
    ];

    const iconBgColors = {
        primary: 'bg-blue-100',
        success: 'bg-green-100',
        purple: 'bg-purple-100'
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-green-400/20 to-blue-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-purple-400/10 to-pink-400/10 rounded-full blur-2xl animate-pulse delay-500"></div>
            </div>

            <div className="relative z-10 container mx-auto px-4 py-8">
                {/* Header with enhanced styling */}
                <div className="mb-16 text-center">
                    <div className="mb-8">
                        <Logo size="large" />
                    </div>
                    <div className="max-w-3xl mx-auto">
                        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4 leading-tight">
                            Hệ thống quản lý
                            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> cơ sở vật chất </span>
                            trường đại học
                        </h1>
                        <p className="text-lg md:text-xl text-gray-600 leading-relaxed">
                            Đặt phòng học, thuê sân thể thao và mượn thiết bị một cách dễ dàng và hiệu quả
                        </p>
                        <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto mt-6 rounded-full"></div>
                    </div>
                </div>

                <main className="container mx-auto px-4">
                    {/* Services Grid with enhanced cards */}
                    <div className="grid md:grid-cols-3 gap-8 mb-16">
                        {services.map((service, index) => (
                            <div
                                key={index}
                                className="group relative bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 border border-white/20 hover:scale-105 hover:-translate-y-2"
                                style={{
                                    animationDelay: `${index * 150}ms`,
                                    animation: 'fadeInUp 0.6s ease-out forwards'
                                }}
                            >
                                {/* Card background gradient overlay */}
                                <div className={`absolute inset-0 bg-gradient-to-br ${service.bgGradient} opacity-0 group-hover:opacity-20 rounded-3xl transition-opacity duration-500`}></div>

                                {/* Floating icon with enhanced styling */}
                                <div className="relative z-10 mb-6">
                                    <div className={`w-20 h-20 ${iconBgColors[service.variant]} rounded-2xl flex items-center justify-center mx-auto shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110`}>
                                        <div className="relative">
                                            {service.icon}
                                            <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-full"></div>
                                        </div>
                                    </div>
                                </div>

                                <div className="relative z-10">
                                    <h3 className="text-2xl font-bold text-center mb-4 text-gray-800 group-hover:text-gray-900 transition-colors">
                                        {service.title}
                                    </h3>
                                    <p className="text-gray-600 text-center mb-8 leading-relaxed">
                                        {service.description}
                                    </p>

                                    <div className="transform group-hover:scale-105 transition-transform duration-300">
                                        <Button
                                            variant={service.variant}
                                            size="full"
                                            className="w-full font-semibold py-3 shadow-lg hover:shadow-xl transition-all duration-300"
                                            onClick={service.onClick}
                                        >
                                            {service.buttonText}
                                        </Button>
                                    </div>
                                </div>

                                {/* Decorative elements */}
                                <div className="absolute top-4 right-4 w-6 h-6 bg-gradient-to-br from-white/40 to-white/10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                <div className="absolute bottom-4 left-4 w-4 h-4 bg-gradient-to-br from-white/30 to-white/5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100"></div>
                            </div>
                        ))}
                    </div>

                    {/* Enhanced CTA Section */}
                    <div className="max-w-lg mx-auto">
                        <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-10 shadow-2xl border border-white/20 relative overflow-hidden">
                            {/* Background decoration */}
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-purple-50/50 rounded-3xl"></div>
                            <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-blue-200/30 to-purple-200/30 rounded-full blur-2xl"></div>

                            <div className="relative z-10">
                                <div className="text-center mb-10">
                                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl">
                                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-3xl font-bold text-gray-800 mb-3">
                                        Bắt đầu ngay hôm nay
                                    </h3>
                                    <p className="text-gray-600 text-lg">
                                        Tham gia hệ thống để trải nghiệm dịch vụ tốt nhất
                                    </p>
                                </div>

                                <div className="space-y-4">
                                    <div className="transform hover:scale-105 transition-transform duration-300">
                                        <Button
                                            variant="primary"
                                            size="full"
                                            className="w-full font-semibold py-4 text-lg shadow-xl hover:shadow-2xl"
                                            onClick={() => navigate('/login')}
                                        >
                                            <svg className="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                                            </svg>
                                            Đăng nhập
                                        </Button>
                                    </div>

                                    <div className="transform hover:scale-105 transition-transform duration-300">
                                        <Button
                                            variant="secondary"
                                            size="full"
                                            className="w-full font-semibold py-4 text-lg shadow-lg hover:shadow-xl"
                                            onClick={() => navigate('/register-student')}
                                        >
                                            <svg className="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                                            </svg>
                                            Đăng ký tài khoản
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Additional Features Section */}
                    <div className="mt-20 text-center">
                        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                            {[
                                {
                                    icon: (
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                        </svg>
                                    ),
                                    title: "Bảo mật cao",
                                    description: "Thông tin cá nhân được bảo vệ tuyệt đối"
                                },
                                {
                                    icon: (
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                        </svg>
                                    ),
                                    title: "Nhanh chóng",
                                    description: "Đặt lịch và xử lý yêu cầu trong tích tắc"
                                },
                                {
                                    icon: (
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                        </svg>
                                    ),
                                    title: "Thân thiện",
                                    description: "Giao diện đơn giản, dễ sử dụng cho mọi người"
                                }
                            ].map((feature, index) => (
                                <div key={index} className="text-center">
                                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                                        {feature.icon}
                                    </div>
                                    <h4 className="text-lg font-semibold text-gray-800 mb-2">{feature.title}</h4>
                                    <p className="text-gray-600 text-sm">{feature.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </main>
            </div>

            {/* Custom animations */}
            <style jsx>{`
                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
            `}</style>
        </div>
    );
};

export default Home;