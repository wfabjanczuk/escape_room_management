import React from 'react';

export default function DemonstrationNote() {
    return <div className='statement'>
        <div className='statement__footer alert alert--error'>
            <div>
                This app is for demonstration purposes.
                To see the admin panel, you can login with using the following credentials:
                <ul>
                    <li><strong>Email</strong>: admin@gmail.com</li>
                    <li><strong>Password</strong>: password</li>
                </ul>
                To see the guest panel, you can login with the same password and any of these emails:
                <ul>
                    <li>linda.yehudit@gmail.com</li>
                    <li>gillian.domantas@gmail.com</li>
                    <li>meagan.ikra@gmail.com</li>
                    <li>sunil.katenka@gmail.com</li>
                </ul>
                Let me know if you find any bugs!
            </div>
        </div>
    </div>
}