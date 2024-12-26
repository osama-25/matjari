import { render } from '@testing-library/react';
import Loading from '../global_components/loading';

describe('Loading component', () => {
    test('renders three bouncing dots', () => {
        const { container } = render(<Loading />);
        
        // Check if main container exists with correct classes
        const mainContainer = container.firstChild;
        expect(mainContainer).toHaveClass('w-screen', 'flex', 'justify-center', 'items-center', 'h-screen');

        // Check if there are exactly 3 bouncing dots
        const bouncingDots = container.querySelectorAll('.bg-blue-700.rounded-full.animate-bounce');
        expect(bouncingDots).toHaveLength(3);

        // Check animation delays
        expect(bouncingDots[0]).toHaveClass('[animation-delay:-0.3s]');
        expect(bouncingDots[1]).toHaveClass('[animation-delay:-0.15s]');
        expect(bouncingDots[2]).not.toHaveClass('[animation-delay]');
    });
});