import React from 'react';
import '../styles/Story.css';

const Story = () => {
  return (
    <div className="story-container">
      <h2 className="story-title">Our Story</h2>
      <div className="story-text">
        <p>
          Two good friends, Khalid and Shahbaz, dreamt of finding good, home cooked 
          Pakistani-Indian food in the Bay Area. Unsatisfied by the offerings at the time, 
          they decided to take matters in their own hands.
        </p>
        <p>
          After much planning, and even more begging to their mothers to teach them 
          family recipes, Khalid and Shahbaz opened their first Pakistani-Indian 
          restaurant in San Francisco in 1998.
        </p>
        <p>
          Excited and passionate about their restaurant, Khalid and Shahbaz, opened 
          this flagship restaurant to not only share their food but also share a 
          little dose of their culture as well.
        </p>
        <p className="story-enjoy">Enjoy!</p>
      </div>

      <div className="mission-section">
        <h2 className="mission-title">Our Mission</h2>
        <div className="mission-text">
          <p>
            At Pakwan, our mission is simple yet profound: to serve love from 
            our culture through every bite of food. We believe that food is the 
            universal language of love, and each dish we prepare carries the 
            warmth and affection of our heritage.
          </p>
          <p>
            Every spice, every ingredient, and every recipe is carefully chosen 
            to create not just a meal, but an experience that connects people 
            through the shared joy of authentic South Asian cuisine.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Story; 