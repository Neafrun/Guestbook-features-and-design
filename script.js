// 방명록 데이터를 저장할 배열
let posts = [];

// 현재 수정 중인 게시물의 인덱스를 저장
let editingIndex = -1;

/**
 * 새 게시물을 추가하는 함수
 */
function addPost() {
    // 입력 필드에서 값 가져오기
    const nameInput = document.getElementById('name');
    const contentInput = document.getElementById('content');
    const imageUrlInput = document.getElementById('imageUrl');
    
    const name = nameInput.value.trim();
    const content = contentInput.value.trim();
    const imageUrl = imageUrlInput.value.trim();
    
    // 입력값이 비어있는지 확인
    if (name === '' || content === '') {
        alert('이름과 내용을 모두 입력해주세요!');
        return;
    }
    
    // 새 게시물 객체 생성
    const newPost = {
        id: Date.now(), // 고유 ID로 현재 시간 사용
        name: name,
        content: content,
        imageUrl: imageUrl, // 이미지 URL 추가
        date: new Date().toLocaleString('ko-KR') // 한국 시간 형식으로 날짜 생성
    };
    
    // 배열의 맨 앞에 새 게시물 추가 (최신 글이 위에 오도록)
    posts.unshift(newPost);
    
    // 입력 필드 초기화
    nameInput.value = '';
    contentInput.value = '';
    imageUrlInput.value = '';
    
    // 화면에 게시물 목록 다시 그리기
    displayPosts();
    
    console.log('새 게시물 추가됨:', newPost);
}

/**
 * 게시물 목록을 화면에 표시하는 함수
 */
function displayPosts() {
    const postList = document.getElementById('postList');
    
    // 게시물이 없으면 안내 메시지 표시
    if (posts.length === 0) {
        postList.innerHTML = '<div class="no-posts">아직 작성된 방명록이 없습니다.</div>';
        return;
    }
    
    // 게시물 목록 HTML 생성
    let html = '';
    posts.forEach((post, index) => {
        // 이미지가 있는 경우 이미지 HTML 추가
        let imageHtml = '';
        if (post.imageUrl) {
            imageHtml = `
                <img src="${post.imageUrl}" 
                     alt="첨부 이미지" 
                     class="post-image"
                     onclick="openImagePopup('${post.imageUrl}')"
                     onerror="handleImageError(this)">
            `;
        }
        
        html += `
            <div class="guestbook-item">
                <div class="item-header">
                    <div class="author-info">${post.name}</div>
                    <div class="date-info">${post.date}</div>
                </div>
                <div class="content">${post.content}</div>
                ${imageHtml}
                <div class="button-group">
                    <button class="edit-btn" onclick="editPost(${index})">수정</button>
                    <button class="delete-btn" onclick="deletePost(${index})">삭제</button>
                </div>
            </div>
        `;
    });
    
    // HTML을 화면에 적용
    postList.innerHTML = html;
}

/**
 * 게시물을 수정 모드로 전환하는 함수
 */
function editPost(index) {
    // 수정할 게시물 정보 가져오기
    const post = posts[index];
    
    // 입력 필드에 기존 내용 채우기
    document.getElementById('name').value = post.name;
    document.getElementById('content').value = post.content;
    document.getElementById('imageUrl').value = post.imageUrl || '';
    
    // 현재 수정 중인 인덱스 저장
    editingIndex = index;
    
    // 버튼 상태 변경 (등록하기 숨기고, 수정하기/취소 보이기)
    document.getElementById('submitBtn').style.display = 'none';
    document.getElementById('updateBtn').style.display = 'inline-block';
    document.getElementById('cancelBtn').style.display = 'inline-block';
    
    console.log('수정 모드 활성화, 인덱스:', index);
}

/**
 * 게시물을 실제로 수정하는 함수
 */
function updatePost() {
    // 입력 필드에서 값 가져오기
    const nameInput = document.getElementById('name');
    const contentInput = document.getElementById('content');
    const imageUrlInput = document.getElementById('imageUrl');
    
    const name = nameInput.value.trim();
    const content = contentInput.value.trim();
    const imageUrl = imageUrlInput.value.trim();
    
    // 입력값이 비어있는지 확인
    if (name === '' || content === '') {
        alert('이름과 내용을 모두 입력해주세요!');
        return;
    }
    
    // 기존 게시물 정보 업데이트 (날짜는 수정 시간으로 변경)
    posts[editingIndex].name = name;
    posts[editingIndex].content = content;
    posts[editingIndex].imageUrl = imageUrl;
    posts[editingIndex].date = new Date().toLocaleString('ko-KR') + ' (수정됨)';
    
    // 수정 모드 종료
    cancelEdit();
    
    // 화면에 게시물 목록 다시 그리기
    displayPosts();
    
    console.log('게시물 수정 완료, 인덱스:', editingIndex);
}

/**
 * 게시물을 삭제하는 함수
 */
function deletePost(index) {
    // 삭제 확인
    if (confirm('정말로 이 게시물을 삭제하시겠습니까?')) {
        // 배열에서 해당 인덱스의 게시물 제거
        const deletedPost = posts.splice(index, 1)[0];
        
        // 화면에 게시물 목록 다시 그리기
        displayPosts();
        
        console.log('게시물 삭제됨:', deletedPost);
    }
}

/**
 * 수정 모드를 취소하는 함수
 */
function cancelEdit() {
    // 입력 필드 초기화
    document.getElementById('name').value = '';
    document.getElementById('content').value = '';
    document.getElementById('imageUrl').value = '';
    
    // 수정 인덱스 초기화
    editingIndex = -1;
    
    // 버튼 상태 원래대로 복원 (등록하기 보이고, 수정하기/취소 숨기기)
    document.getElementById('submitBtn').style.display = 'inline-block';
    document.getElementById('updateBtn').style.display = 'none';
    document.getElementById('cancelBtn').style.display = 'none';
    
    console.log('수정 모드 취소됨');
}

/**
 * 페이지가 로드될 때 실행되는 함수
 */
window.onload = function() {
    console.log('방명록 페이지가 로드되었습니다.');
    
    // 엔터 키로도 게시물을 등록할 수 있도록 이벤트 추가
    document.getElementById('name').addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            document.getElementById('content').focus();
        }
    });
    
    document.getElementById('content').addEventListener('keypress', function(event) {
        if (event.key === 'Enter' && event.ctrlKey) {
            if (editingIndex >= 0) {
                updatePost();
            } else {
                addPost();
            }
        }
    });
};

/**
 * 이미지 클릭 시 새 창에서 크게 보여주는 함수
 */
function openImagePopup(imageUrl) {
    window.open(imageUrl, '_blank', 'width=800,height=600,scrollbars=yes,resizable=yes');
}

/**
 * 이미지 로드 실패 시 처리하는 함수
 */
function handleImageError(imgElement) {
    // 이미지가 로드되지 않으면 에러 메시지로 교체
    imgElement.outerHTML = `
        <div class="image-error">
            <p>❌ 이미지를 불러올 수 없습니다</p>
            <p>링크를 확인해주세요</p>
        </div>
    `;
}