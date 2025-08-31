import React from 'react';

const Button = ({
    children,
    variant = 'primary',
    size = 'default',
    className = '',
    onClick,
    disabled = false,
    type = 'button',
    ...props
}) => {
    const baseClasses = 'font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';

    const variants = {
        primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
        secondary: 'border-2 border-blue-600 text-blue-600 bg-white hover:bg-blue-50 focus:ring-blue-500',
        success: 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500',
        purple: 'bg-purple-600 text-white hover:bg-purple-700 focus:ring-purple-500',
        gray: 'bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500',
        danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500'
    };

    const sizes = {
        sm: 'px-3 py-2 text-sm',
        default: 'px-4 py-3',
        lg: 'px-6 py-4 text-lg',
        full: 'w-full px-4 py-3'
    };

    const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed' : '';

    return (
        <button
            type={type}
            className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${disabledClasses} ${className}`}
            onClick={onClick}
            disabled={disabled}
            {...props}
        >
            {children}
        </button>
    );
};

export default Button;