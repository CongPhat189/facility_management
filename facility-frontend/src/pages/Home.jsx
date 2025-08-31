import React from 'react';

import Logo from '../components/common/Logo';

import Button from '../components/common/Button';
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const navigate = useNavigate();

    const services = [
        {
            title: "Mượn Phòng Học",
            description: "Đăng ký mượn phòng học cho các hoạt động học tập và nghiên cứu",
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
            onClick: () => navigate('/login')
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
            onClick: () => navigate('/login')
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
            onClick: () => navigate('/login')
        }
    ];
    const iconBgColors = {
        primary: 'bg-blue-100',
        success: 'bg-green-100',
        purple: 'bg-purple-100'
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="mb-12">
                    <Logo size="large" />
                </div>

                <main className="container mx-auto px-4 py-8">
                    <div className="grid md:grid-cols-3 gap-8 mb-12">
                        {services.map((service, index) => (
                            <div key={index} className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
                                <div className={`w-16 h-16 ${iconBgColors[service.variant]} rounded-full flex items-center justify-center mx-auto mb-6`}>
                                    {service.icon}
                                </div>
                                <h3 className="text-xl font-semibold text-center mb-4">
                                    {service.title}
                                </h3>
                                <p className="text-gray-600 text-center mb-6">
                                    {service.description}
                                </p>
                                <Button
                                    variant={service.variant}
                                    size="full"
                                    className="w-full"
                                    onClick={service.onClick}
                                >
                                    {service.buttonText}

                                </Button>
                            </div>
                        ))}
                    </div>

                    <div className="max-w-md mx-auto bg-white rounded-2xl p-8 shadow-lg">
                        <h3 className="text-2xl font-semibold text-center mb-8">
                            Bắt đầu sử dụng
                        </h3>
                        <div className="space-y-4">
                            <Button
                                variant="primary"
                                size="full"
                                onClick={() => navigate('/login')}
                            >
                                Đăng nhập
                            </Button>
                            <Button
                                variant="secondary"
                                size="full"
                                onClick={() => navigate('/register-student')}
                            >
                                Đăng ký tài khoản
                            </Button>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Home;