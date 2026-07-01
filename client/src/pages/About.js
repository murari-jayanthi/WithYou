import React from 'react';
import Layout from "./../components/Layout";

const About = () => {
    return (
        <Layout>
            <div className="about-page">
                <h1 className="text-center">About Us</h1>
                <form className="about-form">
                    <div className="form-group">
                        <label htmlFor="about-content">Welcome to WITH YOU platform!</label>
                        <textarea
                            id="about-content"
                            className="form-control"
                            rows="6"
                            readOnly
                        >
                            Welcome to the WITH YOU platform, your trusted partner in healthcare! Our platform connects you with qualified medical professionals who are dedicated to providing you with exceptional care. We believe that healthcare should be accessible and straightforward. Our extensive list of specialists is at your fingertips, ensuring you can make informed choices about your health. Experience personalized support and find the right healthcare provider for your unique needs.
                        </textarea>
                    </div>
                    <div className="form-group">
                        <textarea
                            id="additional-info"
                            className="form-control"
                            rows="6"
                            readOnly
                        >
                            Bacially there are three types of user in this Web,Admin,Docter and User.Users can also apply for a doctor role if interested. The admin will review the application and grant access to the doctor's features, enabling a more tailored healthcare experience for user-docter interaction.Then Normal user can get appointment for the docter through home page docter list
                        </textarea>
                    </div>
                </form>
            </div>
        </Layout>
    );
};

export default About;
