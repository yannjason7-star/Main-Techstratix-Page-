"use client";

import React from 'react';
import './StarBorder.css';

type StarBorderProps<T extends React.ElementType> = React.ComponentPropsWithoutRef<T> & {
  as?: T;
  className?: string;
  children?: React.ReactNode;
  color?: string;
  speed?: string;
  thickness?: number;
  backgroundColor?: string;
  textColor?: string;
  borderColor?: string;
};

const StarBorder = <T extends React.ElementType = 'button'>({
  as,
  className = '',
  color = '#2563EB', // Bleu TechStratix par défaut
  speed = '6s',
  thickness = 1.5,
  backgroundColor = '#101D42', // Fond Bleu Marine par défaut
  textColor = '#ffffff',
  borderColor = '#1e3a8a',
  children,
  ...rest
}: StarBorderProps<T>) => {
  const Component = as || 'button';

  return (
    <Component
      className={`star-border-container ${className} hover:scale-[1.02] transition-transform`}
      {...(rest as any)}
      style={{
        padding: `${thickness}px 0`,
        ...(rest as any).style
      }}
    >
      <div className="border-gradient-bottom" style={{ background: `radial-gradient(circle, ${color}, transparent 10%)`, animationDuration: speed }}></div>
      <div className="border-gradient-top" style={{ background: `radial-gradient(circle, ${color}, transparent 10%)`, animationDuration: speed }}></div>
      <div className="inner-content" style={{ background: backgroundColor, color: textColor, borderColor }}>
        {children}
      </div>
    </Component>
  );
};

export default StarBorder;