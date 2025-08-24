// --- Variáveis Globais e Elementos do DOM ---
const contentTypeCards = document.querySelectorAll('.content-type-cards .card');
const inputFieldsContainer = document.getElementById('input-fields');
const colorPicker = document.getElementById('color-picker');
const textureCards = document.querySelectorAll('.texture-options .texture-card');
const logoInput = document.getElementById('logo-input');
const logoPreview = document.getElementById('logo-preview');
const generateButton = document.getElementById('generate-button');
const downloadButton = document.getElementById('download-button');
const qrCodeBox = document.getElementById('qr-code');
const qrCodePlaceholder = document.getElementById('qr-code-placeholder');
const qrCodeDescription = document.getElementById('qr-code-description');

let currentContentType = 'link'; // Conteúdo ativo por padrão
let selectedQrColor = '#1a56db'; // Cor padrão
let selectedTexture = 'none'; // Textura padrão
let logoFile = null; // Para armazenar o arquivo do logo

// Objeto para armazenar os valores dos inputs dinâmicos
const inputValues = {
    link: '',
    text: '',
    email: { to: '', subject: '', body: '' },
    wifi: { ssid: '', password: '', encryption: 'WPA' }, // WPA como padrão
    sms: { number: '', message: '' },
    tel: '',
    vcard: { name: '', company: '', title: '', phone: '', email: '', url: '' },
    location: { lat: '', lng: '' },
    calendar: { title: '', start: '', end: '', location: '', description: '' },
    social: { platform: '', username: '' }, // Exemplo: { platform: 'instagram', username: 'seunome' }
    video: '', // URL do vídeo
    mp3: '', // URL do mp3
    pdf: '', // URL do pdf
    images: '', // URL para galeria/imagens
    menu: '', // URL para cardápio
    app: '' // URL para app store/play store
};

// --- Funções de Ajuda ---

/**
 * Exibe uma mensagem de alerta personalizada.
 * @param {string} message A mensagem a ser exibida.
 * @param {string} type O tipo de mensagem ('success', 'error', 'info').
 */
function showMessageBox(message, type = 'info') {
    // Implementar um modal ou div de mensagem personalizado aqui,
    // já que 'alert()' não é permitido. Por enquanto, usaremos um console.warn.
    console.warn(`Mensagem (${type}): ${message}`);
    // Exemplo de implementação simples com um div temporário:
    const messageDiv = document.createElement('div');
    messageDiv.textContent = message;
    messageDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 25px;
        border-radius: 8px;
        color: white;
        font-weight: bold;
        z-index: 1000;
        box-shadow: 0 4px 10px rgba(0,0,0,0.2);
        background-color: ${type === 'error' ? '#dc3545' : type === 'success' ? '#28a745' : '#17a2b8'};
    `;
    document.body.appendChild(messageDiv);
    setTimeout(() => {
        messageDiv.remove();
    }, 3000);
}

/**
 * Função para obter o URL da imagem de fundo da textura selecionada
 * @param {string} texture O tipo de textura
 * @returns {string|null} URL da textura ou null se não encontrada
 */
function getTextureImageUrl(texture) {
    const textureData = {
        'dots': 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><circle cx="10" cy="10" r="2" fill="%23e2e8f0"/></svg>',
        'square': 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><rect x="6" y="6" width="8" height="8" fill="%23e2e8f0"/></svg>',
        'star': 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><polygon points="10,2 12.5,7.5 18,7.5 14,11.5 15.5,17 10,14 4.5,17 6,11.5 2,7.5 7.5,7.5" fill="%23e2e8f0"/></svg>'
    };
    return textureData[texture] || null;
}


/**
 * Atualiza os campos de entrada dinamicamente com base no tipo de conteúdo selecionado.
 * @param {string} type O tipo de conteúdo (e.g., 'link', 'text', 'email').
 */
function updateInputFields(type) {
    inputFieldsContainer.innerHTML = ''; // Limpa campos existentes
    currentContentType = type;

    // Remove a classe 'active-input' de todos os inputs, se houver
    document.querySelectorAll('.input-fields-container input, .input-fields-container textarea').forEach(input => {
        input.classList.remove('active-input');
    });

    switch (type) {
        case 'link':
            const linkInput = document.createElement('input');
            linkInput.type = 'url';
            linkInput.id = 'content-input'; // ID genérico para o input principal
            linkInput.placeholder = 'https://seudominio.com.br';
            linkInput.value = inputValues.link;
            linkInput.addEventListener('input', (e) => inputValues.link = e.target.value);
            inputFieldsContainer.appendChild(linkInput);
            break;
        case 'text':
            const textInput = document.createElement('textarea');
            textInput.id = 'content-input';
            textInput.placeholder = 'Digite seu texto aqui...';
            textInput.rows = 5;
            textInput.value = inputValues.text;
            textInput.addEventListener('input', (e) => inputValues.text = e.target.value);
            inputFieldsContainer.appendChild(textInput);
            break;
        case 'email':
            const emailToInput = document.createElement('input');
            emailToInput.type = 'email';
            emailToInput.id = 'email-to-input';
            emailToInput.placeholder = 'Para (email@exemplo.com)';
            emailToInput.value = inputValues.email.to;
            emailToInput.addEventListener('input', (e) => inputValues.email.to = e.target.value);
            inputFieldsContainer.appendChild(emailToInput);

            const emailSubjectInput = document.createElement('input');
            emailSubjectInput.type = 'text';
            emailSubjectInput.id = 'email-subject-input';
            emailSubjectInput.placeholder = 'Assunto';
            emailSubjectInput.value = inputValues.email.subject;
            emailSubjectInput.addEventListener('input', (e) => inputValues.email.subject = e.target.value);
            inputFieldsContainer.appendChild(emailSubjectInput);

            const emailBodyInput = document.createElement('textarea');
            emailBodyInput.id = 'email-body-input';
            emailBodyInput.placeholder = 'Corpo da mensagem...';
            emailBodyInput.rows = 3;
            emailBodyInput.value = inputValues.email.body;
            emailBodyInput.addEventListener('input', (e) => inputValues.email.body = e.target.value);
            inputFieldsContainer.appendChild(emailBodyInput);
            break;
        case 'wifi':
            const ssidInput = document.createElement('input');
            ssidInput.type = 'text';
            ssidInput.id = 'wifi-ssid-input';
            ssidInput.placeholder = 'Nome da Rede (SSID)';
            ssidInput.value = inputValues.wifi.ssid;
            ssidInput.addEventListener('input', (e) => inputValues.wifi.ssid = e.target.value);
            inputFieldsContainer.appendChild(ssidInput);

            const passwordInput = document.createElement('input');
            passwordInput.type = 'password';
            passwordInput.id = 'wifi-password-input';
            passwordInput.placeholder = 'Senha';
            passwordInput.value = inputValues.wifi.password;
            passwordInput.addEventListener('input', (e) => inputValues.wifi.password = e.target.value);
            inputFieldsContainer.appendChild(passwordInput);

            const encryptionSelect = document.createElement('select');
            encryptionSelect.id = 'wifi-encryption-select';
            
            const optionNone = document.createElement('option');
            optionNone.value = 'none';
            optionNone.textContent = 'Nenhuma';
            encryptionSelect.appendChild(optionNone);

            const optionWPA = document.createElement('option');
            optionWPA.value = 'WPA';
            optionWPA.textContent = 'WPA/WPA2';
            encryptionSelect.appendChild(optionWPA);

            const optionWEP = document.createElement('option');
            optionWEP.value = 'WEP';
            optionWEP.textContent = 'WEP';
            encryptionSelect.appendChild(optionWEP);

            encryptionSelect.value = inputValues.wifi.encryption;
            encryptionSelect.addEventListener('change', (e) => inputValues.wifi.encryption = e.target.value);
            inputFieldsContainer.appendChild(encryptionSelect);
            break;
        case 'sms':
            const smsNumberInput = document.createElement('input');
            smsNumberInput.type = 'tel';
            smsNumberInput.id = 'sms-number-input';
            smsNumberInput.placeholder = 'Número de Telefone';
            smsNumberInput.value = inputValues.sms.number;
            smsNumberInput.addEventListener('input', (e) => inputValues.sms.number = e.target.value);
            inputFieldsContainer.appendChild(smsNumberInput);

            const smsMessageInput = document.createElement('textarea');
            smsMessageInput.id = 'sms-message-input';
            smsMessageInput.placeholder = 'Mensagem';
            smsMessageInput.rows = 3;
            smsMessageInput.value = inputValues.sms.message;
            smsMessageInput.addEventListener('input', (e) => inputValues.sms.message = e.target.value);
            inputFieldsContainer.appendChild(smsMessageInput);
            break;
        case 'tel':
            const telInput = document.createElement('input');
            telInput.type = 'tel';
            telInput.id = 'content-input';
            telInput.placeholder = 'Número de Telefone';
            telInput.value = inputValues.tel;
            telInput.addEventListener('input', (e) => inputValues.tel = e.target.value);
            inputFieldsContainer.appendChild(telInput);
            break;
        case 'vcard':
            const vcardNameInput = document.createElement('input');
            vcardNameInput.type = 'text';
            vcardNameInput.id = 'vcard-name-input';
            vcardNameInput.placeholder = 'Nome Completo';
            vcardNameInput.value = inputValues.vcard.name;
            vcardNameInput.addEventListener('input', (e) => inputValues.vcard.name = e.target.value);
            inputFieldsContainer.appendChild(vcardNameInput);

            const vcardCompanyInput = document.createElement('input');
            vcardCompanyInput.type = 'text';
            vcardCompanyInput.id = 'vcard-company-input';
            vcardCompanyInput.placeholder = 'Empresa';
            vcardCompanyInput.value = inputValues.vcard.company;
            vcardCompanyInput.addEventListener('input', (e) => inputValues.vcard.company = e.target.value);
            inputFieldsContainer.appendChild(vcardCompanyInput);

            const vcardTitleInput = document.createElement('input');
            vcardTitleInput.type = 'text';
            vcardTitleInput.id = 'vcard-title-input';
            vcardTitleInput.placeholder = 'Cargo';
            vcardTitleInput.value = inputValues.vcard.title;
            vcardTitleInput.addEventListener('input', (e) => inputValues.vcard.title = e.target.value);
            inputFieldsContainer.appendChild(vcardTitleInput);

            const vcardPhoneInput = document.createElement('input');
            vcardPhoneInput.type = 'tel';
            vcardPhoneInput.id = 'vcard-phone-input';
            vcardPhoneInput.placeholder = 'Telefone';
            vcardPhoneInput.value = inputValues.vcard.phone;
            vcardPhoneInput.addEventListener('input', (e) => inputValues.vcard.phone = e.target.value);
            inputFieldsContainer.appendChild(vcardPhoneInput);

            const vcardEmailInput = document.createElement('input');
            vcardEmailInput.type = 'email';
            vcardEmailInput.id = 'vcard-email-input';
            vcardEmailInput.placeholder = 'E-mail';
            vcardEmailInput.value = inputValues.vcard.email;
            vcardEmailInput.addEventListener('input', (e) => inputValues.vcard.email = e.target.value);
            inputFieldsContainer.appendChild(vcardEmailInput);

            const vcardUrlInput = document.createElement('input');
            vcardUrlInput.type = 'url';
            vcardUrlInput.id = 'vcard-url-input';
            vcardUrlInput.placeholder = 'URL do Website';
            vcardUrlInput.value = inputValues.vcard.url;
            vcardUrlInput.addEventListener('input', (e) => inputValues.vcard.url = e.target.value);
            inputFieldsContainer.appendChild(vcardUrlInput);
            break;
        case 'location':
            const latInput = document.createElement('input');
            latInput.type = 'number';
            latInput.id = 'location-lat-input';
            latInput.placeholder = 'Latitude';
            latInput.step = 'any';
            latInput.value = inputValues.location.lat;
            latInput.addEventListener('input', (e) => inputValues.location.lat = e.target.value);
            inputFieldsContainer.appendChild(latInput);

            const lngInput = document.createElement('input');
            lngInput.type = 'number';
            lngInput.id = 'location-lng-input';
            lngInput.placeholder = 'Longitude';
            lngInput.step = 'any';
            lngInput.value = inputValues.location.lng;
            lngInput.addEventListener('input', (e) => inputValues.location.lng = e.target.value);
            inputFieldsContainer.appendChild(lngInput);
            break;
        case 'calendar':
            const eventTitleInput = document.createElement('input');
            eventTitleInput.type = 'text';
            eventTitleInput.id = 'calendar-title-input';
            eventTitleInput.placeholder = 'Título do Evento';
            eventTitleInput.value = inputValues.calendar.title;
            eventTitleInput.addEventListener('input', (e) => inputValues.calendar.title = e.target.value);
            inputFieldsContainer.appendChild(eventTitleInput);

            const eventStartInput = document.createElement('input');
            eventStartInput.type = 'datetime-local';
            eventStartInput.id = 'calendar-start-input';
            eventStartInput.value = inputValues.calendar.start;
            eventStartInput.addEventListener('input', (e) => inputValues.calendar.start = e.target.value);
            inputFieldsContainer.appendChild(eventStartInput);

            const eventEndInput = document.createElement('input');
            eventEndInput.type = 'datetime-local';
            eventEndInput.id = 'calendar-end-input';
            eventEndInput.value = inputValues.calendar.end;
            eventEndInput.addEventListener('input', (e) => inputValues.calendar.end = e.target.value);
            inputFieldsContainer.appendChild(eventEndInput);

            const eventLocationInput = document.createElement('input');
            eventLocationInput.type = 'text';
            eventLocationInput.id = 'calendar-location-input';
            eventLocationInput.placeholder = 'Localização';
            eventLocationInput.value = inputValues.calendar.location;
            eventLocationInput.addEventListener('input', (e) => inputValues.calendar.location = e.target.value);
            inputFieldsContainer.appendChild(eventLocationInput);

            const eventDescriptionInput = document.createElement('textarea');
            eventDescriptionInput.id = 'calendar-description-input';
            eventDescriptionInput.placeholder = 'Descrição do Evento';
            eventDescriptionInput.rows = 3;
            eventDescriptionInput.value = inputValues.calendar.description;
            eventDescriptionInput.addEventListener('input', (e) => inputValues.calendar.description = e.target.value);
            inputFieldsContainer.appendChild(eventDescriptionInput);
            break;
        case 'social':
            const socialPlatformInput = document.createElement('input');
            socialPlatformInput.type = 'text';
            socialPlatformInput.id = 'social-platform-input';
            socialPlatformInput.placeholder = 'Plataforma (ex: instagram, twitter)';
            socialPlatformInput.value = inputValues.social.platform;
            socialPlatformInput.addEventListener('input', (e) => inputValues.social.platform = e.target.value);
            inputFieldsContainer.appendChild(socialPlatformInput);

            const socialUsernameInput = document.createElement('input');
            socialUsernameInput.type = 'text';
            socialUsernameInput.id = 'social-username-input';
            socialUsernameInput.placeholder = 'Nome de Usuário';
            socialUsernameInput.value = inputValues.social.username;
            socialUsernameInput.addEventListener('input', (e) => inputValues.social.username = e.target.value);
            inputFieldsContainer.appendChild(socialUsernameInput);
            break;
        case 'video':
        case 'mp3':
        case 'pdf':
        case 'images':
        case 'menu':
        case 'app':
            const urlInput = document.createElement('input');
            urlInput.type = 'url';
            urlInput.id = 'content-input';
            urlInput.placeholder = `URL para ${type.charAt(0).toUpperCase() + type.slice(1)}`;
            urlInput.value = inputValues[type];
            urlInput.addEventListener('input', (e) => inputValues[type] = e.target.value);
            inputFieldsContainer.appendChild(urlInput);
            break;
        default:
            break;
    }
}

/**
 * Formata o texto para o QR Code com base no tipo de conteúdo e nos valores dos inputs.
 * @returns {string} O texto formatado para o QR Code.
 */
function formatQrContent() {
    switch (currentContentType) {
        case 'link':
            return inputValues.link.trim();
        case 'text':
            return inputValues.text.trim();
        case 'email':
            const emailTo = inputValues.email.to.trim();
            const emailSubject = inputValues.email.subject.trim();
            const emailBody = inputValues.email.body.trim();
            let emailString = `mailto:${emailTo}`;
            if (emailSubject || emailBody) {
                emailString += '?';
                if (emailSubject) {
                    emailString += `subject=${encodeURIComponent(emailSubject)}`;
                }
                if (emailBody) {
                    emailString += `${emailSubject ? '&' : ''}body=${encodeURIComponent(emailBody)}`;
                }
            }
            return emailString;
        case 'wifi':
            const ssid = inputValues.wifi.ssid.trim();
            const password = inputValues.wifi.password.trim();
            const encryption = inputValues.wifi.encryption;
            if (!ssid) {
                showMessageBox('O SSID da rede Wi-Fi é obrigatório.', 'error');
                return '';
            }
            return `WIFI:S:${ssid};T:${encryption};P:${password};;`;
        case 'sms':
            const smsNumber = inputValues.sms.number.trim();
            const smsMessage = inputValues.sms.message.trim();
            if (!smsNumber) {
                showMessageBox('O número de telefone para SMS é obrigatório.', 'error');
                return '';
            }
            return `SMSTO:${smsNumber}:${encodeURIComponent(smsMessage)}`;
        case 'tel':
            return `tel:${inputValues.tel.trim()}`;
        case 'vcard':
            const vcard = inputValues.vcard;
            let vcardString = 'BEGIN:VCARD\nVERSION:3.0\n';
            if (vcard.name) vcardString += `FN:${vcard.name}\nN:${vcard.name};;;\n`;
            if (vcard.company) vcardString += `ORG:${vcard.company}\n`;
            if (vcard.title) vcardString += `TITLE:${vcard.title}\n`;
            if (vcard.phone) vcardString += `TEL:${vcard.phone}\n`;
            if (vcard.email) vcardString += `EMAIL:${vcard.email}\n`;
            if (vcard.url) vcardString += `URL:${vcard.url}\n`;
            vcardString += 'END:VCARD';
            return vcardString;
        case 'location':
            const lat = inputValues.location.lat.trim();
            const lng = inputValues.location.lng.trim();
            if (!lat || !lng) {
                showMessageBox('Latitude e Longitude são obrigatórias para Localização.', 'error');
                return '';
            }
            return `geo:${lat},${lng}`;
        case 'calendar':
            const cal = inputValues.calendar;
            // Formato iCalendar (simplificado para um evento)
            // Note: date formatting should be more robust
            if (!cal.title || !cal.start) {
                showMessageBox('Título e data/hora de início do evento são obrigatórios.', 'error');
                return '';
            }
            const startDate = cal.start ? new Date(cal.start).toISOString().replace(/[-:]|\.\d{3}/g, '').slice(0, 15) + 'Z' : '';
            const endDate = cal.end ? new Date(cal.end).toISOString().replace(/[-:]|\.\d{3}/g, '').slice(0, 15) + 'Z' : startDate;

            let calendarString = `BEGIN:VCALENDAR\nVERSION:2.0\nBEGIN:VEVENT\n`;
            calendarString += `SUMMARY:${cal.title}\n`;
            calendarString += `DTSTART:${startDate}\n`;
            calendarString += `DTEND:${endDate}\n`;
            if (cal.location) calendarString += `LOCATION:${cal.location}\n`;
            if (cal.description) calendarString += `DESCRIPTION:${cal.description}\n`;
            calendarString += `END:VEVENT\nEND:VCALENDAR`;
            return calendarString;
        case 'social':
            const platform = inputValues.social.platform.toLowerCase().trim();
            const username = inputValues.social.username.trim();
            if (!platform || !username) {
                showMessageBox('Plataforma e nome de usuário são obrigatórios para Redes Sociais.', 'error');
                return '';
            }
            // URLs de exemplo para plataformas populares
            const socialUrls = {
                instagram: `https://instagram.com/${username}`,
                twitter: `https://twitter.com/${username}`,
                linkedin: `https://linkedin.com/in/${username}`,
                facebook: `https://facebook.com/${username}`,
                youtube: `https://youtube.com/user/${username}`,
                tiktok: `https://tiktok.com/@${username}`
            };
            return socialUrls[platform] || `https://www.google.com/search?q=${platform}+${username}`;
        case 'video':
        case 'mp3':
        case 'pdf':
        case 'images':
        case 'menu':
        case 'app':
            return inputValues[currentContentType].trim();
        default:
            return '';
    }
}


// --- Listeners de Eventos ---

// 1. Seleção do Tipo de Conteúdo
contentTypeCards.forEach(card => {
    card.addEventListener('click', () => {
        // Remove 'active' de todos
        contentTypeCards.forEach(c => c.classList.remove('active'));
        // Adiciona 'active' ao clicado
        card.classList.add('active');
        updateInputFields(card.dataset.type);
    });
});

// 2. Seleção de Cor
colorPicker.addEventListener('input', (e) => {
    selectedQrColor = e.target.value;
    // O QR Code será gerado com a nova cor no próximo clique em "Gerar"
});

// 3. Seleção de Textura
textureCards.forEach(card => {
    card.addEventListener('click', () => {
        // Remove 'active' de todos
        textureCards.forEach(t => t.classList.remove('active'));
        // Adiciona 'active' ao clicado
        card.classList.add('active');
        selectedTexture = card.dataset.texture;
        
        // Aplica a textura imediatamente na caixa de pré-visualização
        applyTextureToQrBox();
    });
});

/**
 * Aplica a textura selecionada à caixa do QR code
 */
function applyTextureToQrBox() {
    // Remove qualquer textura anterior
    qrCodeBox.style.backgroundImage = 'none';
    qrCodeBox.style.backgroundRepeat = 'no-repeat';
    qrCodeBox.style.backgroundSize = 'auto';

    // Se uma textura foi selecionada, aplique-a como fundo da caixa
    if (selectedTexture !== 'none') {
        const textureUrl = getTextureImageUrl(selectedTexture);
        if (textureUrl) {
            qrCodeBox.style.backgroundImage = `url('${textureUrl}')`;
            qrCodeBox.style.backgroundRepeat = 'repeat';
            qrCodeBox.style.backgroundSize = '20px 20px';
            qrCodeBox.style.backgroundPosition = 'center';
        }
    }
}

// 4. Upload de Logo
logoInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        logoFile = file; // Armazena o arquivo
        const reader = new FileReader();
        reader.onload = (event) => {
            logoPreview.innerHTML = `<img src="${event.target.result}" alt="Logo Preview">`;
        };
        reader.readAsDataURL(file);
    } else {
        logoFile = null;
        logoPreview.innerHTML = `<span class="placeholder-text">Logo</span>`;
    }
});

// 5. Gerar QR Code
generateButton.addEventListener('click', () => {
    const qrContent = formatQrContent();

    if (!qrContent) {
        showMessageBox('Por favor, preencha o conteúdo para gerar o QR Code.', 'error');
        return;
    }

    qrCodeBox.innerHTML = ''; // Limpa qualquer QR Code anterior
    qrCodePlaceholder.style.display = 'none'; // Esconde o placeholder

    // Aplica a textura selecionada
    applyTextureToQrBox();

    // Cria o QR Code
    new QRCode(qrCodeBox, {
        text: qrContent,
        width: 256,
        height: 256,
        colorDark: selectedQrColor,
        colorLight: "rgba(255, 255, 255, 0)",
        correctLevel: QRCode.CorrectLevel.H
    });

    downloadButton.style.display = 'block'; // Mostra o botão de download
    qrCodeDescription.style.display = 'block';
    qrCodeDescription.textContent = `QR Code gerado para: ${currentContentType}`;

    // Adiciona logo sobre o QR Code se um logo foi carregado
    if (logoFile) {
        setTimeout(() => {
            addLogoToQrCode();
        }, 200); // Delay maior para garantir que o QR code foi renderizado
    }
});

/**
 * Adiciona o logo ao centro do QR code
 */
function addLogoToQrCode() {
    const qrCanvas = qrCodeBox.querySelector('canvas');
    const logoImg = logoPreview.querySelector('img');
    
    if (qrCanvas && logoImg) {
        const ctx = qrCanvas.getContext('2d');
        const img = new Image();
        img.crossOrigin = 'anonymous';
        
        img.onload = () => {
            // Aguarda um pouco mais para garantir que o QR code foi completamente renderizado
            setTimeout(() => {
                // Tamanho do logo (18% do tamanho do QR code)
                const logoSize = qrCanvas.width * 0.18;
                const x = (qrCanvas.width - logoSize) / 2;
                const y = (qrCanvas.height - logoSize) / 2;
                
                // Desenha um fundo branco circular para o logo
                const centerX = qrCanvas.width / 2;
                const centerY = qrCanvas.height / 2;
                const radius = logoSize / 2 + 10;
                
                ctx.fillStyle = 'white';
                ctx.beginPath();
                ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
                ctx.fill();
                
                // Adiciona uma borda sutil ao fundo
                ctx.strokeStyle = '#ddd';
                ctx.lineWidth = 1;
                ctx.stroke();
                
                // Desenha o logo centralizado
                ctx.drawImage(img, x, y, logoSize, logoSize);
                
                console.log('Logo adicionado ao QR code');
            }, 50);
        };
        
        img.onerror = () => {
            console.error('Erro ao carregar a imagem do logo');
        };
        
        img.src = logoImg.src;
    } else {
        console.log('Canvas ou imagem do logo não encontrados');
    }
}

// 6. Download do QR Code
downloadButton.addEventListener('click', () => {
    const qrCanvas = qrCodeBox.querySelector('canvas');
    if (qrCanvas) {
        // Converte o conteúdo do canvas para uma imagem PNG em formato de URL
        const qrImage = qrCanvas.toDataURL("image/png");

        // Define a URL da imagem como o destino do link de download
        downloadButton.href = qrImage;
        
        // Dá um nome ao arquivo
        downloadButton.download = 'qrcode.png';
    } else {
        showMessageBox('Nenhum QR Code gerado para baixar.', 'error');
    }
});

// --- Inicialização (executa quando a página carrega) ---
document.addEventListener('DOMContentLoaded', () => {
    // Inicializa o campo de input para "Link" ao carregar a página
    updateInputFields('link');

    // Define o card 'Link' como ativo ao carregar
    const initialLinkCard = document.querySelector('.content-type-cards .card[data-type="link"]');
    if (initialLinkCard) {
        initialLinkCard.classList.add('active');
    }

    // Define o card de textura 'Padrão' como ativo ao carregar
    const initialTextureCard = document.querySelector('.texture-options .texture-card[data-texture="none"]');
    if (initialTextureCard) {
        initialTextureCard.classList.add('active');
    }
});