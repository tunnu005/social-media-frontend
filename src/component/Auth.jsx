import React, { useState } from "react";
import PropTypes from "prop-types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { signup, login } from "@/services/authServices";
import { Fade } from "react-awesome-reveal";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { Textarea } from "@/components/ui/textarea";

function AuthPage() {
  const [birthDate, setBirthDate] = useState(null);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [profilePic, setProfilePic] = useState(null);
  const [preview, setPreview] = useState(null);
  const [bio, setBio] = useState('');
  const [activeTab, setActiveTab] = useState("signin");
  const [loading, setLoading] = useState(false); // Loading state
  const [inLoading,setinLoading] = useState(false); // In loading state

  const navigate = useNavigate();

  const handleSubmitSignup = async (e) => {
    e.preventDefault();

    // Validation for required fields
    if (!username || !email || !password || !birthDate || !role || !profilePic || !bio) {
      toast("All fields are required", {
        description: "Please fill out all fields, including birth date, profile picture, bio, and role.",
      });
      setLoading(false);
      return;
    }
    setLoading(true); // Start loading


    // console.log({ username, email, password, birthDate, role, profilePic, bio });

    const formData = new FormData();
    formData.append('username', username);
    formData.append('email', email);
    formData.append('password', password);
    formData.append('birthDate', birthDate);
    formData.append('role', role);
    formData.append('file', profilePic);
    formData.append('bio', bio);

    const user = await signup(formData);
    setLoading(false); // Stop loading

    // console.log(user);
    if (user.success) {
      toast(user.message, {
        description: user.description,
        action: {
          label: "Okay",
          onClick: () => {
            setActiveTab("signin");
          },
        },
      });
      setTimeout(() => {
        setActiveTab("signin");
      }, 6000);
    } else {
      toast(user.message, {
        description: user.description,
      });
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setinLoading(true);
    const user = await login({ username, password });
    // console.log('user at auth : ', user);
    setinLoading(false);
    if (user.success) {
      localStorage.setItem('user', JSON.stringify(user.user));
      toast(user.message, {
        description: user.description,
        action: {
          label: "Okay",
          onClick: () => {
            navigate('/home');
          },
        },
      });
      setTimeout(() => {
        navigate('/home');
      }, 3000);
    } else {
      toast(user.message, {
        description: user.description,
        action: {
          label: "Okay",
          onClick: () => {
            // console.log("okay");
          },
        },
      });
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      const base64String = reader.result;
      const imageUrl = `data:${file.type};base64,${base64String.split(',')[1]}`;
      setProfilePic(file);
      setPreview(imageUrl);
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const handleBioChange = (e) => {
    const newBio = e.target.value;
    if (newBio.length <= 150) {
      setBio(newBio);
    } else {
      toast("Bio cannot exceed 150 characters.", { description: "Please shorten your bio." });
    }
  };

  return (
    <Fade>
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">Welcome</CardTitle>
            <CardDescription className="text-center">Sign in or create an account</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="signin">Sign In</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>

              <TabsContent value="signin">
                <form className="space-y-4" onSubmit={handleLogin}>
                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      placeholder="johndoe"
                      required
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-black text-white hover:shadow-lg transform hover:scale-105 transition duration-300 ease-in-out"
                  >
                   {inLoading ? <span className="flex items-center justify-center">
                        <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 0114.9 3.6l-1.6-.8A6 6 0 10.5 12h3.2z" />
                        </svg>
                        Signing In...
                      </span> : " Sign In"}
                  </Button>
                </form>
              </TabsContent>
              <TabsContent value="signup">
                <form className="space-y-4" onSubmit={handleSubmitSignup}>
                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      placeholder="johndoe"
                      required
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="m@example.com"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="birthDate">Birth Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={`w-full justify-start text-left font-normal ${!birthDate && "text-muted-foreground"}`}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {birthDate ? format(new Date(birthDate), "PPP") : <span>Pick a date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <input
                          type="date"
                          value={birthDate}
                          onChange={(e) => setBirthDate(e.target.value)}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400"
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="profile-pic">Profile Picture</Label>
                    <Input
                      id="profile-pic"
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                    />
                    {preview && (
                      <div className="mt-4 flex justify-center">
                        <img
                          src={preview}
                          alt="Profile Preview"
                          className="w-32 h-32 rounded-full object-cover border-2 border-gray-300 shadow-md"
                        />
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      placeholder="Tell us about yourself"
                      value={bio}
                      onChange={handleBioChange}
                      maxLength={150}

                    />
                    <div className="text-sm text-gray-600">
                      {bio.length} / 150 characters
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role">Role</Label>
                    <Select value={role} onValueChange={(value) => setRole(value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your role" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-100">
                        <SelectItem value="student">Student</SelectItem>
                        <SelectItem value="celebrity">Celebrity</SelectItem>
                        <SelectItem value="influencer">Influencer</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button
                    type="submit"
                    className={`w-full bg-black text-white hover:shadow-lg transform hover:scale-105 transition duration-300 ease-in-out ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                    disabled={loading} // Disable button while loading
                  >
                    {loading ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 0114.9 3.6l-1.6-.8A6 6 0 10.5 12h3.2z" />
                        </svg>
                        Signing Up...
                      </span>
                    ) : (
                      "Sign Up"
                    )}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter>
            {/* <Button variant="outline" className="w-full border-2 hover:shadow-lg transform hover:scale-105 transition duration-300 ease-in-out">
              <svg
                className="mr-2 h-4 w-4"
                aria-hidden="true"
                focusable="false"
                data-prefix="fab"
                data-icon="google"
                role="img"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 488 512"
              >
                <path
                  fill="currentColor"
                  d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"
                ></path>
              </svg>
              Sign up with Google
            </Button> */}
          </CardFooter>
        </Card>
      </div>
      <Toaster className="w-[500px]" />
    </Fade>
  );
}

AuthPage.propTypes = {
  // Add any props and their validation here if needed
};

export default AuthPage;
