<template>
    <CommentBox></CommentBox>
    <div class="comment-list" v-for="comment in displayedComments" :key="comment.id">
        <div class="comment-list-root">
            <CommentList  :comment="comment"></CommentList>
        </div>
        <div v-if="comment.subComments" class="sub-comment-list-root" v-for="subcomment in comment.displayedSubComments" :key="subcomment.id">
            <CommentList  :comment="subcomment"></CommentList>
        </div> 
        <div class="load-more-subComments">
            <el-button v-if="comment.canLoadMoreSubComments" @click="loadMoreSubComments(comment)" text>load more replies</el-button>
        </div> 
        
    </div>
    <div>
        <el-button v-if="canLoadMoreComment" @click="loadMoreComment">load more comments</el-button>
    </div>
</template>
<script setup lang = 'ts'>
import{ref} from 'vue'
import CommentBox from '../../components/comment/comment-box.vue'
import CommentList from '../../components/comment/comment-item.vue'
const initializeSubComments = (comment: Comment) => {
    comment.displayedSubComments = comment.subComments?.splice(0, subCommentsPerPage);
    comment.canLoadMoreSubComments = comment.subComments?.length! > 0;
};

interface Comment {
    id: number;
    userName: string;
    content: string;
    avatar: string;
    commentDate: string;
    subComments?: subComment[];
    displayedSubComments?: subComment[];
    canLoadMoreSubComments?: boolean;
}

interface subComment{
    id: number;
    userName: string;
    content: string;
    avatar: string;
    commentDate: string;
}

const comments = ref<Comment[]>([
{
    id: 1,
    userName: 'John',
    content: 'Hello World',
    avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
    commentDate: '2021-07-01 12:00:00',
    subComments: [
        {
            id: 1,
            userName: 'John',
            content: 'Hello World',
            avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
            commentDate: '2021-07-01 12:00:00',
        },
        {
            id: 2,
            userName: 'John',
            content: 'Hello World',
            avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
            commentDate: '2021-07-01 12:00:00',
        },
        {
            id: 3,
            userName: 'John',
            content: 'Hello World',
            avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
            commentDate: '2021-07-01 12:00:00',
        },
    ]
},
{
    id: 2,
    userName: 'gongfan',
    content: 'Hello World',
    avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
    commentDate: '2021-07-01 12:00:00',
    subComments: [
        {
            id: 1,
            userName: 'John',
            content: 'Hello World',
            avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
            commentDate: '2021-07-01 12:00:00',
        },
        {
            id: 2,
            userName: 'John',
            content: 'Hello World',
            avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
            commentDate: '2021-07-01 12:00:00',
        },
        {
            id: 3,
            userName: 'John',
            content: 'Hello World',
            avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
            commentDate: '2021-07-01 12:00:00',
        },
        {
            id: 4,
            userName: 'John',
            content: 'Hello World',
            avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
            commentDate: '2021-07-01 12:00:00',
        },
    ]
},
{
    id: 3,
    userName: 'wulll',
    content: 'Hello World',
    avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
    commentDate: '2021-07-01 12:00:00',
},
{
    id: 4,
    userName: '?????',
    content: 'Hello World',
    avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
    commentDate: '2021-07-01 12:00:00',
}
])



const displayedComments = ref<Comment[]>([]);
const commentsPerPage = 1;
const canLoadMoreComment = ref(comments.value.length > 0);
const loadMoreComment = () => {
    const moreComments = comments.value.splice(0, commentsPerPage);
    moreComments.forEach(comment => {
        initializeSubComments(comment);
    });
    displayedComments.value = [...displayedComments.value, ...moreComments];
    canLoadMoreComment.value = comments.value.length > 0;
    }


const subCommentsPerPage = 2;
const loadMoreSubComments = (comment: Comment) => {
    const moreSubComments = comment.subComments?.splice(0, subCommentsPerPage);
    if (moreSubComments) {
        comment.displayedSubComments = [...comment.displayedSubComments!, ...moreSubComments];
        comment.canLoadMoreSubComments = comment.subComments?.length! > 0;
    }
}

loadMoreComment();


</script>

<style scoped>
.comment-list{
    margin-top: 20px;
}
.sub-comment-list-root{
    padding-left: 72px;
}
.load-more-subComments{
    text-align: left;
    margin-left: 60px;
    
}
</style>