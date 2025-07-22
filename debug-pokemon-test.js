// Quick debug test for pokemon catching
const { render, screen, fireEvent, waitFor, act } = require('@testing-library/react');
const React = require('react');

// Mock the test exactly as written
test('debug pokemon inventory', async () => {
  // Simulate the component render (simplified)
  const MockComponent = () => {
    const [caughtPokemon, setCaughtPokemon] = React.useState([]);
    const [showTeamInterface, setShowTeamInterface] = React.useState(false);
    
    React.useEffect(() => {
      const handlePokemonCaught = (event) => {
        console.log('Event received:', event.detail);
        const { pokemon } = event.detail;
        setCaughtPokemon(prev => [...prev, pokemon]);
      };

      document.addEventListener('pokemonCaught', handlePokemonCaught);
      return () => document.removeEventListener('pokemonCaught', handlePokemonCaught);
    }, []);
    
    return (
      <div>
        <button onClick={() => setShowTeamInterface(true)}>Form Team</button>
        {showTeamInterface && (
          <div>
            <h3>Your Team</h3>
            {caughtPokemon.map((pokemon, index) => (
              <div key={index}>
                {pokemon.name}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };
  
  render(React.createElement(MockComponent));
  
  // Fire the event
  act(() => {
    const catchEvent = new CustomEvent('pokemonCaught', {
      detail: { pokemon: { id: 'hackmon', name: 'Hackmon', type: 'cyber-career' } }
    });
    document.dispatchEvent(catchEvent);
  });

  // Click team button
  const teamButton = screen.getByText(/team/i);
  fireEvent.click(teamButton);

  // Check for Hackmon
  await waitFor(() => {
    expect(screen.getByText('Hackmon')).toBeInTheDocument();
  });
});
