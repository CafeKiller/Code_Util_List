from itertools import product  # ����itertoolsģ���е�product�������������ɵѿ�����
import os  # ����osģ�飬���ڴ����ļ���Ŀ¼

def generate_passwords(length, use_letters, use_digits, use_chars):
    characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789~!@#$%^&*()'
    if not use_letters:
        characters = ''.join([c for c in characters if not c.isalpha()])  # �����ʹ����ĸ������ַ������Ƴ�������ĸ
    if not use_digits:
        characters = ''.join([c for c in characters if not c.isdigit()])  # �����ʹ�����֣�����ַ������Ƴ���������
    if not use_chars:
        characters = ''.join([c for c in characters if c.isalnum() and (not c.isalpha() or not c.isdigit())])  # �����ʹ�������ַ�������ַ������Ƴ����з���ĸ�ͷ����ֵ��ַ�
    return [''.join(p) for p in product(characters, repeat=length)]  # ����ָ�����ȵ������б�ÿ���������ַ����е��ַ����

def write_to_file(passwords, filename):
    with open(filename, 'a') as f:  # ��׷��ģʽ���ļ�
        for password in passwords:  # ���������б�
            f.write(password + '\n')  # ������д���ļ�������ÿ���������ӻ���

def split_file(file_path, max_size):
    # ����ļ��Ƿ����
    if not os.path.exists(file_path):
        print("�ļ�������")
        return
    # ��ȡ�ļ���С
    file_size = os.path.getsize(file_path)
    # ����ļ���СС�ڵ���ָ����С��ֱ�ӷ���
    if file_size <= max_size:
        return
    # ������Ҫ��ֵ��ļ�����
    num = file_size // max_size + (1 if file_size % max_size > 0 else 0)
    # print(num)
    with open(file_path, 'r') as f:
        for i in range(num-1):
            with open(f"{file_path}_{i}.txt", 'w') as temp_file:
                temp_file.write(f.read(max_size))
            print(f"�ļ��Ѳ��Ϊ {file_path}_{i}.txt")
			

if __name__ == '__main__':
    passwords = generate_passwords(4, False, False, True)  # ���ɳ���Ϊ4�������б�������ĸ�����ֺ������ַ����ɸ�����Ҫ�޸Ĳ�����
    #for i in range(10):  # ѭ��10��
    filename = f'Passwords_'  # �����ļ���
    write_to_file(passwords, filename)  # �������б�д���ļ�
    split_file(filename, 5 * 1024 * 1024)  # ���ļ��ָ�Ϊ��󲻳���5MB�����ļ�