import React from 'react'
import FeaturedCard from '../FeaturedCard/FeaturedCard'
import Border from '../Atoms/Border/Border'

function ProfilePost({posts}) {
  return (
    <div className="max-w-[720px] m-auto">
        {posts.map((post) => (
          <>
            <FeaturedCard post={post} />
            <div className="mt-4 my-4">
              <Border />
            </div>
          </>
        ))}
      </div>
  )
}

export default ProfilePost