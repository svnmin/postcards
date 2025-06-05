import { FC } from "react";


const PostcardLayout : FC = () => {

    return(
        <div className="postcard-wrapper">
            <div className="postcard">
                <div className="postcard-inner">
                    <div className="message-container">
                        <input className="message"></input>
                    </div>
                    <div className="track-container">
                        
                    </div>
                    <div className="info-container">

                    </div>
                </div>

            </div>
        </div>
    )
}

export default PostcardLayout;