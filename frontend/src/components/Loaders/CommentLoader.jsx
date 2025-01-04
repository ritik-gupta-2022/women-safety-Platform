import { Comment } from "react-loader-spinner";

import React from 'react'

const CommentLoader = () => {
  return (
    <Comment
            visible={true}
            height="80"
            width="80"
            ariaLabel="comment-loading"
            wrapperStyle={{}}
            wrapperClass="comment-wrapper"
            color="#fff"
            backgroundColor="#466ab4"
    />
  )
}

export default CommentLoader