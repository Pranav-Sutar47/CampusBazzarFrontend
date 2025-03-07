import ChatComponent from './pages/ChatComponent';
import UserProfile from './pages/UserProfile';

function App() {
  return (
    <Router>
      <Routes>
        {/* ... other routes ... */}
        <Route path="/user-profile" element={<UserProfile />} />
        <Route path="/chat" element={<ChatComponent/>}/>

      </Routes>
    </Router>
  );
} 

export default App;
