<?php
/**
 * Plugin Name: Entre Chat Widget
 * Description: Adiciona o chat da Entre ao seu site
 * Version: 1.0
 */

function entre_chat_widget() {
    ?>
    <style>
        #entre-chat { position: fixed; bottom: 30px; right: 30px; z-index: 9999; }
        #entre-chat-btn { width: 60px; height: 60px; border-radius: 50%; background: #000; color: white; border: none; cursor: pointer; box-shadow: 0 4px 12px rgba(0,0,0,0.15); }
        #entre-chat-frame { display: none; position: absolute; bottom: 80px; right: 0; width: 400px; height: 600px; border: none; border-radius: 12px; box-shadow: 0 10px 40px rgba(0,0,0,0.2); }
    </style>
    
    <div id="entre-chat">
        <button id="entre-chat-btn" onclick="document.getElementById('entre-chat-frame').style.display = document.getElementById('entre-chat-frame').style.display === 'none' ? 'block' : 'none'">💬</button>
        <iframe id="entre-chat-frame" src="https://meu-support-agent-production.up.railway.app"></iframe>
    </div>
    <?php
}

add_action('wp_footer', 'entre_chat_widget');
