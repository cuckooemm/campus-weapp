export interface DynamicItemData {
    id:string,
    uid:string,
    name:string,
    avatar:string,
    gender:string,
    content:string,
    image?:IMG,
    browse:number,
    comment_count:number,
    praise_count:number,
    created_at:number
  }

  export interface IMG {
    url:Array<string>,
    url_original:Array<string>
  }

  export interface DynamicCommentData {
    id:string,
    uid:string,
    name:string,
    avatar:string,
    gender:string,
    content:string,
    reply_count:number,
    praise_count:number,
    created_at:string
  }

  export interface CommentReplyData {
    id:string,
    uid:string,
    name:string,
    avatar:string,
    gender:string,
    r_name:string,
    content:string,
    praise_count:number,
    created_at:number
  }

  export interface MessageData {
    id:string,
    uid:string,
    type:number,
    name:string,
    avatar:string,
    gender:string,
    content:string,
    message:string,
    created_at:number,
  }

  export interface UserDynamicData {
    id:string,
    content:string,
    browse:number,
    comment_count:number,
    praise_count:number,
    created_at:number,
  }