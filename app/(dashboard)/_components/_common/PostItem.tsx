"use client";
import Badge from "@/components/badge";

import { Spinner } from "@/components/spinner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PLAN_TYPE } from "@/constants/pricing-plans";

import useLike from "@/hooks/useLike";
import { formatDistanceToNowStrict } from "date-fns";
import { Dot, Heart, MessageCircle } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useCallback, useEffect, useMemo, useRef } from "react";

interface PropsType {
  userId?: number;
  post: PostType;
}

const PostItem: React.FC<PropsType> = ({ post, userId }) => {
  const router = useRouter();

//   ==========================================FUNCION PARA LA Q EL VIDEO PARE LA REPRODUCCION

const videoRef = useRef<HTMLVideoElement | null>(null);

useEffect(() => {
  const observer = new IntersectionObserver(
    ([entry]) => {
      if (videoRef.current) {
        if (!entry.isIntersecting) {
          videoRef.current.pause(); // Pausar si el video no está visible
        }
      }
    },
    { threshold: 0.5 } // El 50% del video debe estar en pantalla para considerarlo visible
  );

  if (videoRef.current) {
    observer.observe(videoRef.current);
  }

  return () => {
    if (videoRef.current) {
      observer.unobserve(videoRef.current);
    }
  };
}, []);

  const { hasLiked, loading, toggleLike } = useLike(
    post?.id,
    post?.likeIds,
    userId
  );

  const goToUser = useCallback(
    (event: { stopPropagation: () => void }) => {
      event.stopPropagation();
      router.push(`/${post?.user?.username}`);
    },
    [router, post?.user?.username]
  );

  const goToPost = useCallback(() => {
    router.push(`/${post?.user?.username}/post/${post.id}`);
  }, [router, post?.user?.username, post?.id]);

  const onLike = useCallback(
    (event: { stopPropagation: () => void }) => {
      event.stopPropagation();
      toggleLike();
    },
    [toggleLike]
  );

  const createdAt = useMemo(() => {
    if (!post.createdAt) return null;

    const timeDifference = formatDistanceToNowStrict(new Date(post.createdAt));
    const timeParts = timeDifference.split(" ");
    let formattedTime;

    if (timeParts[1]?.startsWith("second")) {
      formattedTime = `${timeParts[0]}s`;
    } else if (timeParts[1]?.startsWith("minute")) {
      formattedTime = `${timeParts[0]}min`;
    } else if (timeParts[1]?.startsWith("hour")) {
      formattedTime = `${timeParts[0]}h`;
    } else if (timeParts[1]?.startsWith("day")) {
      formattedTime = `${timeParts[0]}d`;
    } else {
      formattedTime = timeDifference;
    }

    return formattedTime;
  }, [post?.createdAt]);

  return (
    <div
      role="button"
      onClick={goToPost}
      className="
          w-full border-b-[1px]
          dark:border-[rgb(47,51,54)]
          p-5 transition relative
          "
    >
      <div
        className="flex flex-row 
          items-start  gap-3"
      >
        <Avatar role="button" onClick={goToUser}>
          <AvatarImage
            src={post?.user?.profileImage || ""}
            alt={post?.user.username || ""}
            className="object-cover abso"
          />
          <AvatarFallback className="font-bold">
            {post?.user?.name?.[0]}
          </AvatarFallback>
        </Avatar>
        <div className="w-[90%] lg:w-[91.25%]">
          <div className="flex items-center gap-[4px]">
            <div className="flex flex-row gap-[2px]">
              <h5
                className="
              font-bold cursor-pointer
              hover:underline
              "
                role="button"
                onClick={goToUser}
              >
                {post?.user?.name}
              </h5>
              {post?.user?.subscription?.plan === PLAN_TYPE.PRO && <Badge />}
            </div>
            <span
              className="!text-[#959fa8] 
              text-sm inline-block truncate 
              font-normal"
              role="button"
              onClick={goToUser}
            >
              @{post?.user?.username}
            </span>
            <div className="flex items-center">
              <span
                className="!text-[#959fa8]
               text-sm"
              >
                <Dot size="15px" />
              </span>
              <span
                className="!text-[#959fa8] 
              text-sm"
              >
                {createdAt}
              </span>
            </div>
          </div>

          <div className="mt-1 w-full flex  mb-10 border-b-[1px] dark:border-[rgb(47,51,54)]">
            <div
              dangerouslySetInnerHTML={{ __html: post.body }}
              className="lg:h-24 text-black dark:text-white overflow-hidden break-words line-clamp-4 font-semibold"
            />
          </div>

          {post?.postImage && (
            <div
              className="relative w-full my-3 lg:w-full lg:h-[20em] h-[12em]  overflow-hidden rounded-md"
              onClick={(e) => e.stopPropagation()} // Evita la propagación del evento
            >
              <Image
                src={post?.postImage}
                alt={post?.user?.username || "Image"}
                fill
                loading="lazy"
                className="object-cover rounded-md"
              />
            </div>
          )}
          {post?.postVideo && (
            <div className="relative w-full my-3 lg:w-full lg:h-[20em] h-[12em]  overflow-hidden rounded-md"
            onClick={(e) => e.stopPropagation()} // Evita la propagación del evento
            >
              <video
              ref={videoRef} // Asigna el ref
                src={post?.postVideo}
                controls
                className="w-full h-full object-cover rounded-md"
              />
            </div>
          )}
          {post?.postGif && (
            <div className="relative w-full  lg:w-[20em] lg:h-[20em] h-[12em]  overflow-hidden rounded-md"
            onClick={(e) => e.stopPropagation()}>
              <video
                src={post?.postGif}
                muted
                loop
                autoPlay
                playsInline
                disablePictureInPicture
                disableRemotePlayback
                controls={false}
                className="w-[10em] lg:w-full h-full object-cover rounded-lg transition-opacity group-hover:opacity-90 bg-purple-700"
                style={{
                  backgroundColor: "transparent",
                  objectFit: "contain",
                  objectPosition: "center",
                }}
                controlsList="nodownload nofullscreen noremoteplayback"
              />
            </div>
          )}
          <div
            className="flex flex-row 
                  items-center mt-3 gap-10"
          >
            <div
              role="button"
              className="flex flex-row 
              items-center gap-1
            text-[#959fa8]
            cursor-pointer
            transition
            hover:text-primary
            "
            >
              <MessageCircle size={15} />
              <span className="text-sm">{post?.comments?.length || 0}</span>
            </div>

            <div
              role="button"
              className={`flex flex-row 
              items-center gap-1
            text-[#959fa8]
            cursor-pointer
            transition
           hover:text-red-500
            ${loading ? "pointer-events-none" : ""}
            `}
              onClick={onLike}
            >
              {loading && <Spinner />}
              <Heart
                className={hasLiked ? "fill-red-500 !stroke-red-500" : ""}
                size={15}
              />
              <span className="text-sm">{post?.likeIds?.length || 0}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostItem;
