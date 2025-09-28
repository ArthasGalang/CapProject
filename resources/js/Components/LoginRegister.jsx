import React from 'react';
import '@css/app.css';

const LoginRegister = () => {
    return (
                <div className="modalOverlay">
                    <div className="authModal">
                        <button className="authModalClose" onClick={() => setShowModal(false)}>&times;</button>
                        <div className="authModalContent">
                            <div className="authModalLeft">
                                <h2>{modalTab === 'login' ? 'Welcome Back!' : 'Join the Community!'}</h2>
                                <p>{modalTab === 'login' ? 'Log in to discover and shop local treasures.' : 'Register to start buying and selling in your barangay.'}</p>
                            </div>
                            <div className="authModalRight">
                                <div className="authModalTabs">
                                    <button className={modalTab === 'login' ? 'active' : ''} onClick={() => setModalTab('login')}>Login</button>
                                    <button className={modalTab === 'register' ? 'active' : ''} onClick={() => setModalTab('register')}>Register</button>
                                </div>
                                {modalTab === 'login' ? (
                                    <form className="authModalForm">
                                        <input type="email" placeholder="Email" />
                                        <input type="password" placeholder="Password" />
                                        <button type="submit">Login</button>
                                    </form>
                                ) : (
                                    <>
                                      <div style={{ maxHeight: 320, overflowY: 'auto', width: '100%' }}>
                                        <form className="authModalForm" style={{
                                            display: 'grid',
                                            gridTemplateColumns: '180px 180px',
                                            gap: '1.1rem 1.2rem',
                                            marginBottom: '1.2rem',
                                            justifyContent: 'center',
                                            alignItems: 'start',
                                            width: '100%',
                                            minWidth: 0,
                                            marginLeft: 'auto',
                                            marginRight: 'auto'
                                        }}>
                                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                                              <label style={{ fontWeight: 500, marginBottom: 4 }}>First Name</label>
                                              <input type="text" placeholder="" />
                                          </div>
                                          <div style={{ display: 'flex', flexDirection: 'column' }}>
                                              <label style={{ fontWeight: 500, marginBottom: 4 }}>Last Name</label>
                                              <input type="text" placeholder="" />
                                          </div>
                                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                                              <label style={{ fontWeight: 500, marginBottom: 4 }}>Age</label>
                                              <input type="number" placeholder="" />
                                          </div>
                                          <div style={{ display: 'flex', flexDirection: 'column' }}>
                                              <label style={{ fontWeight: 500, marginBottom: 4 }}>Mobile Number</label>
                                              <input type="text" placeholder="" />
                                          </div>
                                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                                              <label style={{ fontWeight: 500, marginBottom: 4 }}>Email</label>
                                              <input type="email" placeholder="name@example.com" />
                                          </div>
                                          <div style={{ display: 'flex', flexDirection: 'column' }}>
                                              <label style={{ fontWeight: 500, marginBottom: 4 }}>Password</label>
                                              <input type="password" placeholder="" />
                                          </div>
                                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                                              <label style={{ fontWeight: 500, marginBottom: 4 }}>Confirm Password</label>
                                              <input type="password" placeholder="" />
                                          </div>
                                          <div></div>
                                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                                              <label style={{ fontWeight: 500, marginBottom: 4 }}>Barangay</label>
                                              <input type="text" placeholder="" />
                                          </div>
                                          <div style={{ display: 'flex', flexDirection: 'column' }}>
                                              <label style={{ fontWeight: 500, marginBottom: 4 }}>Municipality</label>
                                              <input type="text" placeholder="" />
                                          </div>
                                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                                              <label style={{ fontWeight: 500, marginBottom: 4 }}>Street</label>
                                              <input type="text" placeholder="" />
                                          </div>
                                          <div></div>
                                        </form>
                                      </div>
                                      <div style={{ marginTop: '0.7rem', width: '100%' }}>
                                        <button type="submit" style={{ width: '100%' }} class="registerBtn">Register</button>
                                      </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
    );
};

export default LoginRegister;